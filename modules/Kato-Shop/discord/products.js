const {
  Message,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  BaseInteraction,
  quote,
} = require("discord.js");
const Client = require("../../../core/ClientBuilder");

const PERMISSION_ERROR = "You don't have permission to use this command";
const NO_PRODUCTS_FOUND = "No products found";
const ACTION_PROMPT = "Pilih aksi yang ingin dilakukan";
const PRICE_STOCK_ERROR = "Price and Stock must be a number, please try again";

class ProductManager {
  /**
   *
   * @param {Client} client
   * @param {Message} message
   */
  constructor(client, message) {
    /** @type {Client} */
    this.client = client;

    /** @type {Message} */
    this.message = message;

    /** @type {Array} */
    this.products = [];

    /** @type {EmbedBuilder} */
    this.embed = null;

    /** @type {Message} */
    this.msg = null;
  }

  /**
   * Create product manager
   * @returns {Promise<void>}
   */
  async init() {
    if (!this.message.member.permissions.has("ManageChannels")) {
      return this.message.reply(PERMISSION_ERROR);
    }

    this.products = await this.client.katoShop.manager.getProducts();
    const buttons = this.createActionButtons();
    this.embed = this.createProductEmbed(this.message.guild, this.products);

    this.msg = await this.message.channel.send({
      embeds: [this.embed],
      components: [buttons],
    });

    this.createCollector();
  }

  /**
   * Create collector for product manager
   * @returns {void}
   */
  createCollector() {
    const filter = (interaction) =>
      interaction.user.id === this.message.author.id && interaction.isButton();
    const collector = this.msg.createMessageComponentCollector({
      filter,
      time: 30000,
    });

    collector.on("collect", async (interaction) => {
      switch (interaction.customId) {
        case "add":
          return this.addProduct(interaction);
        case "edit":
          return this.editProduct(interaction);
        case "delete":
          return this.deleteProduct(interaction);
        default:
          return;
      }
    });

    collector.on("end", () => {
      this.msg.edit({ components: [] });
    });
  }

  /**
   *
   * @param {BaseInteraction} interaction
   */
  async addProduct(interaction) {
    const modal = this.createProductModal("add_product", "Add Product");
    await interaction.showModal(modal);

    this.client.once("interactionCreate", async (i) => {
      if (!i.isModalSubmit() || i.customId !== "add_product") return;
      await this.handleAddProduct(interaction, i);
    });
  }

  async handleAddProduct(lastInteraction, interaction) {
    interaction.deferUpdate();

    const name = interaction.fields.getTextInputValue("name");
    const price = interaction.fields.getTextInputValue("price");
    const stock = interaction.fields.getTextInputValue("stock");

    if (isNaN(price) || isNaN(stock)) {
      return lastInteraction.followUp({
        content: PRICE_STOCK_ERROR,
        ephemeral: true,
      });
    }

    const product = await this.client.katoShop.manager.addProduct({
      name,
      price,
      stock,
    });
    this.products.push(product);
    this.updateProductEmbed(this.embed, this.products);

    lastInteraction.followUp({
      content: `Product **${product.name}** has been added`,
    });
    this.msg.edit({ embeds: [this.embed] });
  }

  async editProduct(interaction) {
    await interaction.deferUpdate();
    if (!this.products.length) return interaction.reply(NO_PRODUCTS_FOUND);

    await this.message.reply("Pilih product yang ingin diedit (gunakan nomor)");

    const filter = (m) => m.author.id === this.message.author.id;
    const collector = this.message.channel.createMessageCollector({
      filter,
      time: 30000,
    });

    collector.on("collect", async () => {
      const product =
        this.products[parseInt(collector.collected.first().content) - 1];
      if (!product) return this.message.reply("Product not found");

      const buttons = this.createEditButtons(product);
      const embed = this.createProductEmbed(
        this.message.guild,
        [product],
        `Edit Product: ${product.name}`
      );

      const msg = await this.message.channel.send({
        embeds: [embed],
        components: [buttons],
      });
      await this.handleEditProduct(product, msg, embed);
    });
  }

  async handleEditProduct(product, msg) {
    const collector = msg.channel.createMessageComponentCollector({
      filter: (interaction) =>
        interaction.user.id === this.message.author.id &&
        interaction.isButton(),
      time: 60000,
    });

    collector.on("collect", async (interaction) => {
      const [action] = interaction.customId.split("_");

      switch (action) {
        case "edit":
          return this.showEditProductModal(interaction, product, msg);
        case "disable":
        case "enable":
          return this.toggleProductAvailability(
            interaction,
            product,
            msg,
            action
          );
        case "delete":
          return this.deleteProduct(interaction, product, msg);
        default:
          return;
      }
    });

    collector.on("end", () => {
      msg.edit({ components: [] });
    });
  }

  async showEditProductModal(interaction, product, msg) {
    const modal = this.createProductModal(
      `edit_product_${product.id}`,
      `Edit Product: ${product.name}`,
      product
    );
    await interaction.showModal(modal);

    this.client.once("interactionCreate", async (i) => {
      if (!i.isModalSubmit() || i.customId !== `edit_product_${product.id}`)
        return;
      await this.handleEditProductModal(interaction, i, product, msg);
    });
  }

  async handleEditProductModal(lastInteraction, interaction, product, msg) {
    interaction.deferUpdate();

    const name = interaction.fields.getTextInputValue("name");
    const price = interaction.fields.getTextInputValue("price");
    const stock = interaction.fields.getTextInputValue("stock");

    if (isNaN(price) || isNaN(stock)) {
      return lastInteraction.followUp({
        content: PRICE_STOCK_ERROR,
        ephemeral: true,
      });
    }

    await this.client.katoShop.manager.editProduct(product.id, {
      name,
      price,
      stock,
    });
    const updatedProduct = await this.client.katoShop.manager.getProductById(
      product.id
    );
    const buttons = this.createEditButtons(updatedProduct);

    const embed = this.createProductEmbed(
      this.message.guild,
      [updatedProduct],
      `Edit Product: ${updatedProduct.name}`
    );
    msg.edit({ embeds: [embed], components: [buttons] });

    lastInteraction.followUp({
      content: `Product **${product.name}** has been updated`,
    });
  }

  async toggleProductAvailability(interaction, product, msg, action) {
    await this.client.katoShop.manager.editProduct(product.id, {
      isAvailable: action === "enable",
    });
    const updatedProduct = await this.client.katoShop.manager.getProductById(
      product.id
    );
    const buttons = this.createEditButtons(updatedProduct);

    const embed = this.createProductEmbed(
      this.message.guild,
      [updatedProduct],
      `Edit Product: ${updatedProduct.name}`
    );
    msg.edit({ embeds: [embed], components: [buttons] });

    interaction.reply({
      content: `Product **${product.name}** has been ${
        action === "enable" ? "enabled" : "disabled"
      }`,
    });
  }

  async deleteProduct(interaction, product = null, msg = null) {
    if (!product) {
      await this.message.reply(
        "Pilih product yang ingin dihapus (gunakan nomor)"
      );

      const filter = (m) => m.author.id === this.message.author.id;
      const collector = this.message.channel.createMessageCollector({
        filter,
        time: 30000,
      });

      collector.on("collect", async () => {
        const product =
          this.products[parseInt(collector.collected.first().content) - 1];
        if (!product) return this.message.reply("Product not found");

        await this.handleDeleteProduct(interaction, product);
      });
    } else {
      msg.delete();
      await this.handleDeleteProduct(interaction, product);
    }
  }

  async handleDeleteProduct(lastInteraction, product) {
    await this.client.katoShop.manager.deleteProduct(product.id);
    this.products.splice(this.products.indexOf(product), 1);
    this.updateProductEmbed(this.embed, this.products);

    lastInteraction.reply({
      content: `Product **${product.name}** has been deleted`,
    });
    this.msg.edit({ embeds: [this.embed] });
  }

  createActionButtons() {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("add")
        .setLabel("Add")
        .setStyle(ButtonStyle.Primary),
      new ButtonBuilder()
        .setCustomId("edit")
        .setLabel("Edit")
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId("delete")
        .setLabel("Delete")
        .setStyle(ButtonStyle.Danger)
    );
  }

  createEditButtons(product) {
    return new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`edit_product_${product.id}`)
        .setLabel("Edit")
        .setStyle(ButtonStyle.Primary),
      product.isAvailable
        ? new ButtonBuilder()
            .setCustomId(`disable_product_${product.id}`)
            .setLabel("Disable")
            .setStyle(ButtonStyle.Secondary)
        : new ButtonBuilder()
            .setCustomId(`enable_product_${product.id}`)
            .setLabel("Enable")
            .setStyle(ButtonStyle.Success),
      new ButtonBuilder()
        .setCustomId(`delete_product_${product.id}`)
        .setLabel("Delete")
        .setStyle(ButtonStyle.Danger)
    );
  }

  createProductEmbed(guild, products, title = "Manage Products") {
    return new EmbedBuilder()
      .setTitle(title)
      .setAuthor({
        name: guild.name,
        iconURL: guild.iconURL({ dynamic: true }),
      })
      .setDescription(
        products.length > 0
          ? products
              .map((product, i) => {
                const p = quote(
                  `🎟️ ${product.price} Tickets - \`Tersisa ${product.stock}\``
                );
                return `${i + 1}. **${product.name}** - ${
                  product.isAvailable ? "🟢" : "🔴"
                } \n${p}`;
              })
              .join("\n")
          : NO_PRODUCTS_FOUND
      )
      .setColor("Random")
      .setFooter({ text: ACTION_PROMPT });
  }

  updateProductEmbed(embed, products) {
    embed.setDescription(
      products.length > 0
        ? products
            .map((p, i) => {
              const q = quote(`🎟️ ${p.price} Tickets - \`Tersisa ${p.stock}\``);
              return `${i + 1}. **${p.name}** - ${
                p.isAvailable ? "🟢" : "🔴"
              } \n${q}`;
            })
            .join("\n")
        : NO_PRODUCTS_FOUND
    );
  }

  createProductModal(customId, title, product = {}) {
    const nameInput = new TextInputBuilder()
      .setCustomId("name")
      .setLabel("Product Name")
      .setPlaceholder("String")
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setValue(product.name || "");

    const priceInput = new TextInputBuilder()
      .setCustomId("price")
      .setLabel("Product Price")
      .setPlaceholder("Number")
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setValue(product.price ? `${product.price}` : "");

    const stockInput = new TextInputBuilder()
      .setCustomId("stock")
      .setLabel("Product Stock")
      .setPlaceholder("Number")
      .setRequired(true)
      .setStyle(TextInputStyle.Short)
      .setValue(product.stock ? `${product.stock}` : "");

    return new ModalBuilder()
      .setCustomId(customId)
      .setTitle(title)
      .addComponents(
        new ActionRowBuilder().addComponents(nameInput),
        new ActionRowBuilder().addComponents(priceInput),
        new ActionRowBuilder().addComponents(stockInput)
      );
  }
}

module.exports = ProductManager;

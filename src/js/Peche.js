export default class Peche extends Phaser.Scene {
  // constructeur de la classe
  constructor() {
    super({
      key: "Peche" //  ici on précise le nom de la classe en tant qu'identifiant
    });
  }
  preload() {
    this.load.image("Phaser_TileSet", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("cartePeche", "src/assets/peche.json");
  }

  create() {
    const CartePeche = this.add.tilemap("cartePeche");

    // chargement du jeu de tuiles
    const tileset = CartePeche.addTilesetImage(
      "TileSet_VF",
      "Phaser_TileSet"
    );
    // chargement de chaque calque
    const fond = CartePeche.createLayer(
      "fond",
      tileset
    );
    // chargement de chaque calque
    const bord = CartePeche.createLayer(
      "bord",
      tileset
    );
    // chargement de chaque calque
    const pont = CartePeche.createLayer(
      "pont",
      tileset
    );
    // chargement de chaque calque
    const chemin = CartePeche.createLayer(
      "chemin",
      tileset
    );
    // chargement de chaque calque
    const maison = CartePeche.createLayer(
      "maison",
      tileset
    );

    // chargement de chaque calque
    const legume = CartePeche.createLayer(
      "legume",
      tileset
    );
    // chargement de chaque calque
    const arbre = CartePeche.createLayer(
      "arbre",
      tileset
    );
    const objects = [fond, bord, pont, chemin, maison, legume, arbre];
    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));

    this.player = this.physics.add.sprite(200, 200, "img_perso");
    this.player.setBounce(0.2); // on donne un petit coefficient de rebond
    this.player.setCollideWorldBounds(true); // le player se cognera contre les bords du monde
    this.player.setSize(16, 16);
    this.player.setOffset(16, 16);
  }

  update() {
    if (this.keys.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_gauche", true);
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_droite", true);
    } else {
      this.player.setVelocityX(0);
    }

    // Déplacement vertical
    if (this.keys.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play("anim_dos", true);
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play("anim_face", true);
    } else {
      this.player.setVelocityY(0);
    }

    // Si aucune touche n'est pressée, jouer l'animation de repos
    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play("anim_repos");
    }
  }
}
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
    fct.doNothing();
    fct.doAlsoNothing();
 
    tscene = this;
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
 
 
 
    this.porte_retour = this.physics.add.staticSprite(100, 550, "img_porte1");
 
    this.player = this.physics.add.sprite(100, 450, "img_perso");
    this.player.refreshBody();
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.clavier = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.groupe_plateformes);
  }
 
  update() {
    if (this.clavier.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_tourne_gauche", true);
    } else if (this.clavier.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_tourne_droite", true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play("anim_face");
    }
    if (this.clavier.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }
 
    if (Phaser.Input.Keyboard.JustDown(this.clavier.space) == true) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.scene.switch("selection");
      }
    }
  }
}
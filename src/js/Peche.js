export default class Peche extends Phaser.Scene {
  constructor() {
    super({ key: "Peche" });
  }

  preload() {
    this.load.image("Phaser_TileSet_Peche", "src/assets/TileSet_VF.png");
    this.load.tilemapTiledJSON("cartePeche", "src/assets/peche.json");

    // Création PNJ
    this.load.image("Pecheur", "src/assets/PNG/Pecheur.png");
    this.load.image("PNJ1", "src/assets/PNG/PNJ1.png");
    this.load.image("PNJ_5", "src/assets/PNG/PNJ_5.png");
    this.load.image("PNJ_6", "src/assets/PNG/PNJ_6.png");

    // Création img Rivière
    this.load.image("Poisson", "src/assets/Riviere/Poisson.png");
    this.load.image("Encre", "src/assets/Riviere/Encre.png");
    this.load.image("SacP", "src/assets/Riviere/SacP.png");
    this.load.image("Crabe", "src/assets/Riviere/Crabe.png");
    this.load.image("EtoileJ", "src/assets/Riviere/EtoileJ.png");
    this.load.image("EtoileR", "src/assets/Riviere/EtoileR.png");

    
    this.load.image("PorteExit2", "src/assets/PorteExit2.png");

   
    this.load.image("bullet", "src/assets/balle.png");
  }

  create() {
    const CartePeche = this.add.tilemap("cartePeche");
    const tileset = CartePeche.addTilesetImage("TileSet_VF", "Phaser_TileSet_Peche");

    const Fond = CartePeche.createLayer("Fond", tileset);
    const Herbe = CartePeche.createLayer("Herbe", tileset);
    const Accesoire = CartePeche.createLayer("Accesoire", tileset);
    const Legume = CartePeche.createLayer("Legume", tileset);
    const objects = [Fond, Herbe, Accesoire, Legume];

    objects.forEach(obj => obj.setCollisionByProperty({ estSolide: true }));

    /****************************
     *  RECUPERATION DU PERSONNAGE  
     ****************************/
    this.player = this.physics.add.sprite(320, 570, "img_perso");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(16, 16);
    this.player.setOffset(16, 16);

    this.groupeBullets = this.physics.add.group();
    this.objetsFlottants = this.physics.add.group();

    // Ajout de la direction par défaut
    this.lastDirection = "right";

    /***********************
     *  CREATION DES PNJ 
     ************************/
    this.Pecheur = this.physics.add.sprite(320, 240, "Pecheur");
    this.PNJ1 = this.physics.add.sprite(320, 120, "PNJ1");
    this.PNJ_5 = this.physics.add.sprite(140, 200, "PNJ_5");
    this.PNJ_6 = this.physics.add.sprite(100, 500, "PNJ_6");

    /*****************************************************
     *  GESTION DES INTERACTIONS ENTRE PERSO ET PORTE 
     ******************************************************/
    this.porte_retour = this.physics.add.staticSprite(320, 622, "PorteExit2");

    /***********************
     *  CREATION DU CLAVIER 
     ************************/
    this.clavier = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.Z,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.Q,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      fire: Phaser.Input.Keyboard.KeyCodes.A // Touche A pour tirer
    });

    /*****************************************************
     *  GESTION DES INTERACTIONS ENTRE GROUPES ET ELEMENTS 
     ******************************************************/
    this.physics.add.collider(this.player, objects);
    this.physics.add.collider(this.groupeBullets, this.objetsFlottants, this.detruireObjet, null, this);

    /***********************
     *  CREATION DE LA RIVIERE 
     ************************/
    this.timer = this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: this.spawnFloatingObject,
      callbackScope: this
    });


    this.score = 0;
    this.scoreText = this.add.text(500, 10, "Score: 0", {
      fontSize: "20px",
      fill: "#fff",
      padding: { x: 10, y: 5 }
    });

    this.scoreText.setScrollFactor(0);
    this.scoreText.setDepth(1000);


    this.cameras.main.setBounds(0, 0, 640, 640);
    this.physics.world.setBounds(0, 0, 640, 640);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  spawnFloatingObject() {
    const objets = ["Poisson", "Encre", "SacP", "Crabe", "EtoileJ", "EtoileR"];
    const typeObjet = Phaser.Utils.Array.GetRandom(objets);

    const yPosition = Phaser.Math.Between(245, 380);
    const objet = this.objetsFlottants.create(-50, yPosition, typeObjet);

    objet.setVelocityX(50);
    objet.setScale(0.5);
  }

  tirer() {
    const bulletSpeed = 300;
    const bullet = this.groupeBullets.create(this.player.x, this.player.y, "bullet");

    bullet.setCollideWorldBounds(false);
    bullet.setScale(0.5);

    switch (this.lastDirection) {
      case "right":
        bullet.setVelocityX(bulletSpeed);
        break;
      case "left":
        bullet.setVelocityX(-bulletSpeed);
        break;
      case "up":
        bullet.setVelocityY(-bulletSpeed);
        break;
      case "down":
        bullet.setVelocityY(bulletSpeed);
        break;
    }
  }

  detruireObjet(bullet, objet) {
    bullet.destroy();
    objet.destroy();

    if (objet.texture.key === "Encre") {
      this.score -= 3;
    } else {
      this.score += 1;
    }

    this.scoreText.setText("Score: " + this.score);
  }

  update() {
    this.player.setVelocity(0);

    if (this.keys.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play("anim_gauche", true);
      this.lastDirection = "left";
    } else if (this.keys.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play("anim_droite", true);
      this.lastDirection = "right";
    }

    if (this.keys.up.isDown) {
      this.player.setVelocityY(-160);
      this.player.anims.play("anim_dos", true);
      this.lastDirection = "up";
    } else if (this.keys.down.isDown) {
      this.player.setVelocityY(160);
      this.player.anims.play("anim_face", true);
      this.lastDirection = "down";
    }

    if (this.player.body.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play("anim_repos");
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.fire)) {
      this.tirer();
    }

    if (Phaser.Input.Keyboard.JustDown(this.clavier.space)) {
      if (this.physics.overlap(this.player, this.porte_retour)) {
        this.game.config.fromPeche = true;
        this.game.config.x = 1600;
        this.game.config.y = 1600;
        this.scene.start("General");
      }
    }
  }
}
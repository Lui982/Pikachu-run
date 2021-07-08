var pikachu, pikachu_running, trex_collided,edges;
var suelo2, nube, nube1, cielo, cielo1;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOverImg, restartImg;
var jumpSound , checkPointSound, dieSound;


function preload(){
  
pikachu_running = loadAnimation("Pika1.png","Pika2.png","Pika3.png","Pika4.png");
  trex_collided = loadAnimation("trex_collided.png");
  gameOverImg = loadImage("gameOver.png")
  restartImg = loadImage("restart.png")
  suelo2 = loadImage("cespe7.png");
  nube1 = loadImage("nube.png");
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  cielo1 = loadImage("cesped.png");
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup(){
    //crea el lienzo
    createCanvas(600,200);
   
    //crea el fodo 
    cielo = createSprite(1010,90,600,10);
    cielo.addImage("cesped", cielo1);
  
    //crea el suelo  
    suelo = createSprite(750,160,600,10);
    suelo.addImage("cespe7", suelo2);
  
    //crea al Pikachu
  pikachu = createSprite(50,160,20,50);
    pikachu.addAnimation("running", pikachu_running);
    edges = createEdgeSprites();
    pikachu.addAnimation("collided" , trex_collided)
    
  //añade escala y posición al Trex
    pikachu.scale = 0.06;
    pikachu.x = 50;
    suelo.scale = 0.9
    
    //crea un suelo para que el pikachu no caiga
    invisibleground = createSprite(300,192,600,10);
    invisibleground.visible = false;
    
   gameOver =  createSprite(300,100);
  gameOver.addImage(gameOverImg);
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
    obstaclesGroup = new Group ();
    cloudsGroup = new Group ();
    pikachu.setCollider("rectangle",0,0,610,600);
    pikachu.debug = false
    score = 0;
    
}

function draw(){
        //establece un color de fondo 
    background("white");
      
  
     
  
    if(gameState === PLAY){
    //move the ground
    suelo.velocityX = -(4 + 3* score/100);
    //scoring
    score = score + Math.round(getFrameRate()/60);
     if (score > 0 && score%100 === 0){
      checkPointSound.play();
     }
    gameOver.visible = false;
    restart.visible = false;
      
    if (suelo.x < 0){
        suelo.x = 725;
    } 
    
    //jump when the space key is pressed
    if(keyDown("space") && pikachu.y >=159 || keyDown("UP") && pikachu.y >=159){
        pikachu.velocityY = -13;
        jumpSound.play();
    }
    
    //add gravity
    console.log (pikachu.y);
  pikachu.velocityY = pikachu.velocityY + 0.7;
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
      
    
    if(obstaclesGroup.isTouching(pikachu)){
        gameState = END;
      dieSound.play();
       
    }
  }
   else if (gameState === END) {
     
     gameOver.visible = true;
     restart.visible = true;    
     pikachu.velocityY = 0;
     pikachu.changeAnimation("collided",trex_collided);
     pikachu.scale = 0.06
     obstaclesGroup.setLifetimeEach (-1);
     cloudsGroup.setLifetimeEach (-1);
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);
     suelo.velocityX = 0;
       if (keyDown("space") || mousePressedOver(restart) || keyDown("UP")){
        reset();
         
       }
   }
    
     //evita que el Trex caiga
   pikachu.collide(invisibleground)      
    drawSprites();
            fill ("black")        
        //crea la puntuacion
        text("score: "+ score, 500,20);
         
}

   function spawnClouds (){
   if (frameCount % 60 === 0){
     nube = createSprite (585,50,20,20);
     nube.velocityX = -2.5;
     nube.lifetime = 400
     nube.addImage("nube", nube1);
     nube.scale = 0.25;
     nube.y = Math.round(random(50,120))
     nube.depth = pikachu.depth;
     pikachu.depth = pikachu.depth +1 ;
     cloudsGroup.add(nube);
   }
 }

  function spawnObstacles (){
    if (frameCount % 60 === 0){
      var obstaculo = createSprite(600,165,10,20);
      obstaculo.velocityX = -(5 + score/100);
      var rand = Math.round(random(1,6));
      switch (rand){
        case 1: obstaculo.addImage(obstacle1);
        break;
        case 2: obstaculo.addImage(obstacle2);
        break
        case 3: obstaculo.addImage(obstacle3);
        break;
        case 4: obstaculo.addImage(obstacle4);
        break;
        case 5: obstaculo.addImage(obstacle5);
        break;
        case 6: obstaculo.addImage(obstacle6);
        break;
        default: break;
      }
      obstaculo.scale = 0.5;
      obstaculo.lifetime = 300;
      obstaclesGroup.add(obstaculo);
    }
  }
function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;  
  pikachu.changeAnimation("running", pikachu_running);
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0
  
}
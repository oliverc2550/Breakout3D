//Game Framework Load Content File
//Scene Setup Region
// #region Scene Setup
const scene = new THREE.Scene();
const loader = new THREE.FontLoader();
//var gui = new dat.GUI();
//Unable to get Delta time to work, game movement is framerate dependant
//var clock = new THREE.Clock();
//var delta;

//Light
const light = new THREE.DirectionalLight(0xffffff, 1, 100);
light.position.set(0, 0, 15);
light.castShadow = true;
light.shadow.mapSize.width = 3840; 
light.shadow.mapSize.height = 2160;
light.shadow.camera = new THREE.OrthographicCamera(-100, 100, -100, 100, 0.5, 1000);
// #region LightingDebug
//const helper = new THREE.CameraHelper(light.shadow.camera);
//gui.add(light, 'intensity', 0, 25);
//gui.add(light.position, 'x', 0, 50);
//gui.add(light.position, 'y', 0, 50);
//gui.add(light.position, 'z', 0, 50);
// #endregion
scene.add(light);

// Game Music and SFX
var audio = document.createElement('audio');
var source = document.createElement('source');
source.src = 'Sounds/bounce.mp3'; //Sound from Zapsplat.com
audio.appendChild(this.source);
// #endregion
//2D/3D Text Region
// #region 2D/3D Text
//Bools to determine what 2D/3D text is displayed
//Enums and Gamestate would have been used instead if Javascript had that functionality
var textScreen = true;
var titleScreen = true;
var controlsScreen = false;
var tryAgainScreen = false;
var winScreen = false;

//UI Variables and 2D Text Variables
var lives = 3;
var livesUIDisplay = new SpriteText("Lives: " + lives, new THREE.Vector3(15, -2, 0));

var score = 0;
var scoreMultiplier = 1;
var scoreUIDisplay = new SpriteText("Score: " + (score * scoreMultiplier), new THREE.Vector3(-20, -2, 0));

function AddGameplayUI()
{
    scene.add(livesUIDisplay);
    scene.add(scoreUIDisplay);
}

//Title Screen 2D/3D Text
//Three.Group used due to issues with the scope of meshes declared within the loader.load function and to allow for easy adding and removing from the game scene
var titleGroup = new THREE.Group();
loader.load('fonts/helvetiker_regular.typeface.json', function (font)
{

    const geometryTitle = new THREE.TextGeometry('Breakout 3D', {
        font: font,
        size: 5,
        height: 0.5,
    });
    const materialTitle = new THREE.MeshPhongMaterial({ color: 0x993300 });
    var title = new THREE.Mesh(geometryTitle, materialTitle);
    title.position.set(-20, 10, 0);
    titleGroup.add(title);
});
var titleUIDisplay1 = new SpriteText("Press [Enter]", new THREE.Vector3(-3, 8, 0));
var titleUIDisplay2 = new SpriteText("Created by Oliver Collier", new THREE.Vector3(-4, 1, 0));
var titleUIDisplay3 = new SpriteText("Music: 80s Motivational Chiptune by Shane Ivers - https://www.silvermansound.com", new THREE.Vector3(-12, 0, 0));
var titleUIDisplay4 = new SpriteText("Music from Sound from https://www.zapsplat.com", new THREE.Vector3(-7, -1, 0));
titleGroup.add(titleUIDisplay1, titleUIDisplay2, titleUIDisplay3, titleUIDisplay4);
scene.add(titleGroup);

//Controls Screen 2D/3D Text
//Three.Group used due to issues with the scope of meshes declared within the loader.load function and to allow for easy adding and removing from the game scene
var controlsGroup = new THREE.Group();
loader.load('fonts/helvetiker_regular.typeface.json', function (font)
{

    const geometryTitle = new THREE.TextGeometry('Controls:', {
        font: font,
        size: 3,
        height: 0.5,
    });
    const materialTitle = new THREE.MeshPhongMaterial({ color: 0x993300 });
    var controls = new THREE.Mesh(geometryTitle, materialTitle);
    controls.position.set(-8, 10, 0);
    controlsGroup.add(controls);
});
var controlsUIDisplay1 = new SpriteText("Use [A] and [D] to move the paddle", new THREE.Vector3(-6, 8, 0));
var controlsUIDisplay2 = new SpriteText("Collect falling blocks to get a powerup", new THREE.Vector3(-6, 7, 0));
var controlsUIDisplay3 = new SpriteText("Make it through all 18 levels to win!", new THREE.Vector3(-6, 6, 0));
var controlsUIDisplay4 = new SpriteText("Press [Enter] to Play", new THREE.Vector3(-4, 5, 0));
controlsGroup.add(controlsUIDisplay1, controlsUIDisplay2, controlsUIDisplay3, controlsUIDisplay4);

//Game Over Screen 2D/3D Text
//Three.Group used due to issues with the scope of meshes declared within the loader.load function and to allow for easy adding and removing from the game scene
var loseGroup = new THREE.Group();
loader.load('fonts/helvetiker_regular.typeface.json', function (font)
{

    const geometryTitle = new THREE.TextGeometry('Out of Lives', {
        font: font,
        size: 3,
        height: 0.5,
    });
    const materialTitle = new THREE.MeshPhongMaterial({ color: 0x993300 });
    var title = new THREE.Mesh(geometryTitle, materialTitle);
    title.position.set(-12, 10, 0);
    loseGroup.add(title);
});
var tryAgainUIDisplay = new SpriteText("Press [Enter] to Try Again", new THREE.Vector3(-5, 8, 0));
loseGroup.add(tryAgainUIDisplay);

//Win Screen 2D/3D Text
//Three.Group used due to issues with the scope of meshes declared within the loader.load function and to allow for easy adding and removing from the game scene
var winGroup = new THREE.Group();
loader.load('fonts/helvetiker_regular.typeface.json', function (font)
{

    const geometryTitle = new THREE.TextGeometry('You Win!', {
        font: font,
        size: 5,
        height: 0.5,
    });
    const materialTitle = new THREE.MeshPhongMaterial({ color: 0x993300 });
    var title = new THREE.Mesh(geometryTitle, materialTitle);
    title.position.set(-15, 10, 0);
    winGroup.add(title);
});
var winUIDisplay = new SpriteText("Press [Enter] to Play Again", new THREE.Vector3(-5, 8, 0));
winGroup.add(winUIDisplay);
// #endregion
//3D Game Objs Region
// #region 3D Game Objs
//Arrays used to store Bricks and Powerups, used in Ball/Paddle.Collision methods
var brickList = [];
var powerUpList = [];
var collidableMeshList = [];
//Bool used by one of the powerup effects
var unbreakable = false;

//Paddle
var paddle = new Paddle();

//Ball
var ballPrime = new Ball();

//Function for adding the Ball and Paddle to the scene once the game starts
function BallAndPaddleSpawner()
{
    paddle.mesh.position.set(0, 0, 0)
    paddle.mesh.geometry = new THREE.BoxGeometry(5, 1, 1);
    ballPrime.mesh.position.set(0, 10, 0);
    scene.add(paddle.mesh, ballPrime.mesh);
}
//Function used to create and position the rows of bricks for use within the game
//Variables that aren't assigned a value have it assigned by the SetLevel function
//Brick Spawner
var numOfRows;
var numOfBricks = 7;
var startPosX = -17;
var startPosY;
var brickLength = 5;
var brickHeight = 1;

function BrickSpawner()
{
    for (var rows = 0; rows < numOfRows; rows++)
    {
        for (var bricks = 0; bricks < numOfBricks; bricks++)
        {
            var brick = new Brick(rows, startPosX, startPosY);
            brick.mesh.position.set(startPosX, startPosY, 0);
            brickList.push(brick);
            startPosX += brickLength;
        }
        startPosX = -17;
        startPosY += brickHeight;
    }
}
//Function used to populate the parallel array used by Ball.Collision and to add the brick meshes to the scene
function SceneAndArrayAdding()
{
    for (var i = 0; i < brickList.length; i++)
    {
        collidableMeshList.push(brickList[i].mesh);
    }
    collidableMeshList.push(paddle.mesh);
    for (var i = 0; i < brickList.length; i++)
    {
        scene.add(brickList[i].mesh);
    }
}

//Background Plane
//Background Plane is added initally due to it always being in the scene
var background = new Background();
background.mesh.position.set(0, 0, -2);
scene.add(background.mesh);

// #endregion
//SoundTrack variable and function
var soundtrack = document.getElementById("gameSoundtrack");

function Soundtrack()
{
    soundtrack.play();
    soundtrack.volume = 0.035;
    document.getElementById("gameSoundtrack").loop = true;
}
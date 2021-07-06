//Game Framework Update File
//Threejs Render and camera
const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//const controls = new THREE.OrbitControls(camera, renderer.domElement);

camera.position.set(-1, 10, 18);
//controls.update();

//EventListeners
document.addEventListener("keydown", PressEnter, false);
document.addEventListener("keydown", KeyDownHandler, false);
document.addEventListener("keyup", KeyUpHandler, false);
//Region for EventHandler Functions
// #region EventHandler Functions
//Eventhandler function for when the enter key is pressed
//If enums and gamestate were supported by Javascript they would have been used instead of if/ if else statements
//async function used to allow ball to not move immediately upon start of the game and to display level UI element
async function PressEnter(event)
{
	var keyCode = event.which;
	if (keyCode == 13 && titleScreen == true && textScreen == true)
	{
		Soundtrack();
		scene.remove(titleGroup);
		titleScreen = false;
		controlsScreen = true;
		scene.add(controlsGroup);
	}
	else if (keyCode == 13 && controlsScreen == true && textScreen == true)
	{
		scene.remove(controlsGroup);
		controlsScreen = false;
		textScreen = false;
		BallAndPaddleSpawner();
		ballPrime.ResetBall();
		ResetGameVars();
		SetLevel();
		var levelDisplay = new SpriteText("Level " + level, new THREE.Vector3(-1, 8, 0));
		scene.add(levelDisplay);
		let delay = await WaitDelay(3000);
		scene.remove(levelDisplay);
		ballPrime.StartBall();
	}
    else if (keyCode == 13 && tryAgainScreen == true && textScreen == true)
	{
		scene.remove(loseGroup);
		tryAgainScreen = false;
		controlsScreen = true;
		scene.add(controlsGroup);
	}
	else if (keyCode == 13 && winScreen == true && textScreen == true)
	{
		scene.remove(winGroup);
		winScreen = false;
		controlsScreen = true;
		scene.add(controlsGroup);
	}
}

//Eventhandler functions for keydown/keyup events, used to move the paddle
function KeyDownHandler(event) 
{
	var keyCode = event.which;
	if (keyCode == 65) 
	{
		paddle.leftPressed = true;
	}
	else if (keyCode == 68) 
	{
		paddle.rightPressed = true;
	}
}

function KeyUpHandler(event) 
{
	var keyCode = event.which;
	if (keyCode == 65) 
	{
		paddle.leftPressed = false;
	}
	else if (keyCode == 68) 
	{
		paddle.rightPressed = false;
	}
}
// #endregion
//Region for Various Bespoke Functions
// #region Bespoke Functions
//Function to itterate over powerUpList array and properly cause powerups to fall
function CheckIsFalling()
{
	for (var i = 0; i < powerUpList.length; i++)
	{
        if (powerUpList[i].isFalling === true)
		{
			powerUpList[i].PowerUpFall();
        }
    }
}

//Functions used to update the Lives and Score UI elements
function UpdateLives()
{
	scene.remove(livesUIDisplay);
	livesUIDisplay = new SpriteText("Lives: " + lives, new THREE.Vector3(15, -2, 0));
	scene.add(livesUIDisplay);
}

function UpdateScore()
{
	scene.remove(scoreUIDisplay);
	scoreUIDisplay = new SpriteText("Score: " + (score * scoreMultiplier), new THREE.Vector3(-20, -2, 0));
	scene.add(scoreUIDisplay);
}

//Function to reset the variables used to determine level, lives and score. Called when the player Wins or loses and decides to try again
function ResetGameVars()
{
	lives = 3;
	score = 0;
	level = 1;
}

//Function to remove all bricks from scene
function RemoveBricks()
{
	for (var i = brickList.length - 1; i >= 0; i--)
	{
		scene.remove(brickList[i].mesh);
		brickList.splice(i, 1);
		collidableMeshList.splice(i, 1);
	}

}

//Function used to check whether the player has cleared the level or run out of lives
//async function used to allow ball to not move immediately upon start of the game and to display level UI element
async function CheckWinLoss()
{
    if (brickList.length == 0)
	{
		collidableMeshList.pop();
		level++;
		SetLevel();
        if (level !== 19)
		{
			ballPrime.ResetBall();
			var levelDisplay = new SpriteText("Level " + level, new THREE.Vector3(-1, 8, 0));
			scene.add(levelDisplay);
			let delay = await WaitDelay(3000);
			scene.remove(levelDisplay);
			ballPrime.StartBall();
        }
	}
    if (lives == 0)
	{
		//Game Over Man
		textScreen = true;
		collidableMeshList.pop();
		scene.remove(paddle.mesh, ballPrime.mesh);
		RemoveBricks();
		scene.add(loseGroup);
		tryAgainScreen = true;
    }
}
// #endregion
//Update Function used to update the scene and various objects within every frame
//Due to not being able to get delta time functioning properly all game functions are framerate dependant
function update()
{
	requestAnimationFrame(update);
	renderer.render(scene, camera);
	//delta = clock.getDelta();
	if (textScreen == false)
	{
		paddle.PaddleMovement();
		paddle.Collision();
		ballPrime.Collision();
		CheckIsFalling();
		UpdateLives();
		UpdateScore();
		CheckWinLoss();
    }
	scene.autoUpdate = true;
};
update();
//Paddle Class
//Contains properties for movement speed, left/rightpressed bools used by eventhandler functions and Threejs Geometry, Material and Mesh
//Contains methods for Paddle movement and detecting powerup collisions
//Most properties are public so that they can be properly accessed by other functions in the game 
//Due to Javascript syntax if they were set to private they would not have the needed scope
class Paddle
{
	constructor()
	{
		this.xSpeed = 0.125;
		this.rightPressed = false;
		this.leftPressed = false;
		this.geometry = new THREE.BoxGeometry(5, 1, 1);
		var material = new THREE.MeshPhongMaterial({ color: 0x993300 });
		this.mesh = new THREE.Mesh(this.geometry, material);
		this.mesh.castShadow = true;
		this.mesh.receiveShadow = false;
	}
	PaddleMovement()
	{
		if (this.leftPressed == true && this.mesh.position.x >= -18.5)
		{
			//console.log("Right Pressed");
			this.mesh.position.x -= this.xSpeed;
			this.mesh.updateMatrixWorld();
		}
		else if (this.rightPressed == true && this.mesh.position.x <= 18)
		{
			//console.log("Left Pressed");
			this.mesh.position.x += this.xSpeed;
			this.mesh.updateMatrixWorld();
		}
	}
	//Original collision code from - https://stemkoski.github.io/Three.js/Collision-Detection.html
	//Code modified for use within class using Class keyword, to correctly determine which powerup has been hit and activate it's effect through the use of parallel arrays
	//Code also makes use of game variables to change their values so they can be properly updated by other bespoke functions
	//Commented out code used for debugging, unless otherwise stated
	Collision()
	{
			var originPoint = this.mesh.position.clone();
			this.mesh.updateMatrixWorld();

			var collidablePowerUpList = [];
			for (var i = 0; i < powerUpList.length; i++)
			{
				collidablePowerUpList.push(powerUpList[i].mesh);
			}

			for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++)
			{
				this.mesh.updateMatrixWorld();
				var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
				var globalVertex = localVertex.applyMatrix4(this.mesh.matrix);
				var directionVector = globalVertex.sub(this.mesh.position);

				var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());

				var collisionResults = ray.intersectObjects(collidablePowerUpList);
				if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length())
				{
					//console.log("intersect");
					//var collidingPowerUpInfo = powerUpList.find(powerUp => powerUp.mesh.uuid === collisionResults[0].object.uuid);
					var collidingPowerUp = powerUpList.findIndex(powerUp => powerUp.mesh.uuid === collisionResults[0].object.uuid);
					//console.log(collidingPowerUpInfo);
					//console.log(collidingPowerUp);
					scene.remove(powerUpList[collidingPowerUp].mesh);
					powerUpList[collidingPowerUp].PowerUpEffect();
					powerUpList.splice(collidingPowerUp, 1);
					collidablePowerUpList.splice(collidingPowerUp, 1);
				}
			}
	}
}
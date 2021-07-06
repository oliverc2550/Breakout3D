//Switch Statement and Level variable for changing the level of the game
//Obj spawning functions called to properly populate the level
var level = 0;

function SetLevel()
{
    switch (level)
    {
        case 1:
            numOfRows = 1;
            startPosY = 22;
            BrickSpawner();
            SceneAndArrayAdding();
            AddGameplayUI();
            break;
        case 2:
        case 3:
            numOfRows = 1;
            startPosY = 22;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 4:
        case 5:
        case 6:
            numOfRows = 2;
            startPosY = 21;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 7:
        case 8:
        case 9:
            numOfRows = 3;
            startPosY = 20;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 10:
        case 11:
        case 12:
            numOfRows = 4;
            startPosY = 19;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 13:
        case 14:
        case 15:
            numOfRows = 5;
            startPosY = 18;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 16:
        case 17:
        case 18:
            numOfRows = 6;
            startPosY = 17;
            BrickSpawner();
            SceneAndArrayAdding();
            break;
        case 19:
            textScreen = true;
            scene.remove(paddle.mesh, ballPrime.mesh);
            scene.add(winGroup);
            winScreen = true;
            break;
    }
}

//SetLevel();
//캔버스 세팅
let canvas;
let ctx;

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 650;

document.body.appendChild(canvas);


//이미지 불러오기
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;
let gameOver = false; //true이면 게임이 끝남, false이면 게임이 안 끝남
let score = 0;

//우주선 좌표(계속 바뀔 예정)
let spaceshipX = canvas.width/2-32;
let spaceshipY = canvas.height-64;


let bulletList = [] //생성된 총알 저장 리스트
function Bullet() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.x = spaceshipX + 20;
        this.y = spaceshipY;
        this.alive = true; //true = 살아있는 총알, false = 죽은 총알

        bulletList.push(this);
    }

    this.update = function() {
        this.y -= 12; //총알 속도
    }

    this.checkHit = function() {
        for(let i = 0; i < enemyList.length; i++) {
            if(this.y <= enemyList[i].y && this.x >= enemyList[i].x && this.x <= enemyList[i].x + 40) {
                score++;
                this.alive = false; //죽은 총알로 변경
                enemyList.splice(i, 1);
            }
        }
    }
}


function generateRandomValue(min, max) {
    let randomNum = Math.floor(Math.random()*(max - min + 1)) + min;
    return randomNum;
}

let enemyList = [];
function Enemy() {
    this.x = 0;
    this.y = 0;
    this.init = function() {
        this.y = 0;
        this.x = generateRandomValue(0, canvas.width - 64);
        enemyList.push(this);

        this.update = function() {
            this.y += 3; //적군 속도

            if(this.y >= canvas.height - 64) {
                gameOver = true;  
            }
        }
    }
}

function loadImage() {
    backgroundImage = new Image();
    backgroundImage.src = 'images/deepspace.gif';

    spaceshipImage = new Image();
    spaceshipImage.src = 'images/spaceship.png';

    bulletImage = new Image();
    bulletImage.src = 'images/bullet.png';

    enemyImage = new Image();
    enemyImage.src = 'images/enemy.png';

    gameOverImage = new Image();
    gameOverImage.src = 'images/gameover.png';
}


let keysDown = {};
function setupKeyboardListener() {
    document.addEventListener('keydown', function(event) {
        keysDown[event.keyCode] = true;
    })
    document.addEventListener('keyup', function(event) {
        delete keysDown[event.keyCode];

        if(event.keyCode == 32) {
            createBullet()
        }
    })
    
}

function createBullet() {
    //스페이스바 누르면 실행되는 함수
    let b = new Bullet();
    b.init()
}

function createEnemy() {
    const interval = setInterval(function() {
        let e = new Enemy();
        e.init();
    }, 1500) //호출하고 싶은 함수, 호출 딜레이 시간
}

function update() {
    if(39 in keysDown) {
        spaceshipX += 7; //우주선 이동 속도
    }
    if(37 in keysDown) {
        spaceshipX -= 7; //우주선 이동 속도
    }

    if(spaceshipX <= 0) {
        spaceshipX = 0;
    }

    if(spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }

    //총알의 y좌표 업데이트 하는 함수 호출
    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {//살아있는 총알만 적군을 죽일 수 있음(총알 하나로 적군 중복 제거 방지)
            bulletList[i].update();
            bulletList[i].checkHit(); //총알이 적군에 닿았는지 체크
        }
    }

    //적군의 y좌표 업데이트
    for(let i = 0; i < enemyList.length; i++) {
        enemyList[i].update();
    }


}

//이미지 그리기
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
    ctx.fillText(`Score:${score}`, 20, 30);
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';

    for(let i = 0; i < bulletList.length; i++) {
        if(bulletList[i].alive) {
            ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
        }//alive = true인 총알만 화면에 그려줌
    }

    for(let i = 0; i < enemyList.length; i++) {
        ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
    }
}

function main() {
    if(!gameOver) {
        update()//좌표 값 업데이트 후
        render()//그려주기
        requestAnimationFrame(main);
    } else{
        ctx.drawImage(gameOverImage, 25, 150, 350, 350);
    }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

//총알만들기
//스페이스바 누르면 총알 생성
//총알 y값 = --, x값 = 스페이스바를 누른 순간의 우주선 x좌표
//발사된 총알들은 배열에 저장

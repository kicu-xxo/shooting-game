//캔버스 세팅
let canvas;
let ctx;

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');

canvas.width = 400;
canvas.height = 700;

document.body.appendChild(canvas);


//이미지 불러오기
let backgroundImage,spaceshipImage,bulletImage,enemyImage,gameOverImage;

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

        bulletList.push(this);
    }

    this.update = function() {
        this.y -= 10;
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
    let b = new Bullet;
    b.init()
}

function update() {
    if(39 in keysDown) {
        spaceshipX += 6;
    }
    if(37 in keysDown) {
        spaceshipX -= 6;
    }

    if(spaceshipX <= 0) {
        spaceshipX = 0;
    }

    if(spaceshipX >= canvas.width - 64) {
        spaceshipX = canvas.width - 64;
    }

    //총알의 y좌표 업데이트 하는 함수 호출
    for(let i = 0; i < bulletList.length; i++) {
        bulletList[i].update();
    }
}

//이미지 그리기
function render() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);

    for(let i = 0; i < bulletList.length; i++) {
        ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y)
    }
}

function main() {
    update()//좌표 값 업데이트 후
    render()//그려주기
    requestAnimationFrame(main);
}

loadImage()
setupKeyboardListener()
main()

//총알만들기
//스페이스바 누르면 총알 생성
//총알 y값 = --, x값 = 스페이스바를 누른 순간의 우주선 x좌표
//발사된 총알들은 배열에 저장

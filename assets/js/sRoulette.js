// option example
// {
//     btnId : '#SrouletteBtn', // 룰렛돌리는 버튼 id
//     rouletteNum : '6', // 룰렛 갯수
//     rouletteRotateNum: '5', // 룰렛 돌아가는 회전수
//     rouletteSpeed : '1000', // 속도
//     rouletteItemName : ['1장','한번더 참여','꽝!','4장','3장','2장'], // 룰렛 상품 등록 - 반시계방향 등록
//     rouletteIteExemption : ['1','2'], // 제외처리 index - 배열이기때문에 0부터 시작 ex) ['1','2']
//     rouletteProbability : [25,25,25,25],
//     flag : 'Y' // 클릭 한번만 가능 'N' , 반복가능 'Y'
// }
var Sroulette = (function(){
    var clickFlag = 'Y';
    function Sroulette(id, option, imgSetting) {
        var _this = this;
        this.id = id || "#Sroulette";
        this.btnId = option.btnId || '#SrouletteBtn';
        this.rouletteNum = option.rouletteNum || 4;
        this.oneItemDeg = 360/this.rouletteNum;
        this.rouletteRotateNum = option.rouletteRotateNum || 5;
        this.rouletteSpeed = option.rouletteSpeed || 5000;
        this.rouletteItemName = option.rouletteItemName || ['1칸','2칸','3칸','4칸'];
        this.rouletteIteExemption = option.rouletteIteExemption || '';
        this.rouletteProbability = option.rouletteProbability || [25,25,25,25];
        this.flag = option.flag || 'N';
        this.roulette = $(this.id);

        this.imgSetting = imgSetting || '';


        this.part = '';
        this.imgSrc = this.roulette.attr('src');
        this.urlRoot = 'http://images.coocha.co.kr/mweb/imgs/promotion/';
        var rouletteSelector = this.roulette;
        var imgRoot = this.urlRoot;

        $(this.btnId).on('click', function () {
            rouletteSelector.attr('src', imgRoot+'roulette.png');
            if(clickFlag === 'Y') _this.rotation();
        });

    }

    Sroulette.prototype.rotation = function(){
        var maxNumber = Number(this.probability());
        var _this = this;
        if(this.flag === 'Y') clickFlag = 'Y';
        else clickFlag = 'N';


        $(this.id).rotate({
            angle:0,
            animateTo:360 * this.rouletteRotateNum +  _this.randomize(maxNumber-(this.oneItemDeg-1), maxNumber-(this.oneItemDeg/2)),
            center: ["50%", "50%"],
            callback: function(){
                var deg = $(this).getRotateAngle();
                _this.endAnimate(deg);
            },
            duration: this.rouletteSpeed
        });
    };

    Sroulette.prototype.probability = function () {
        // 확률 계산
        var probabilityRange = []; // Ex) ['89','179','269','359'];
        var probabilityArr = []; // 확률 배열
        for(var i = 0; i < this.rouletteNum; i++){
            if(this.rouletteIteExemption[i-1] === String(i)){
            }else {
                probabilityRange.push(((i+1)*this.oneItemDeg)-1)
                probabilityArr.push(this.rouletteProbability[i])
            }
        }

        var randomVal = Math.random();
        // console.log('probabilityRange : ',probabilityRange);
        // console.log('probabilityArr : ',probabilityArr);

        var persent = 0;
        var maxPersent = 0;
        for(var key in probabilityArr){
            maxPersent += probabilityArr[key];
            if(persent <= randomVal*100  && randomVal*100 < maxPersent){
                return probabilityRange[key];
            }
            persent += probabilityArr[key]
        }
    };

    Sroulette.prototype.randomize = function (min, max) {
        // 난수 만들기
        var randomVal = Math.random();
        return Math.floor(randomVal * (max - min + 1)) + min;
    };

    Sroulette.prototype.endAnimate = function (deg) {
        var rouletteVal = this.rouletteItemName;
        var n = deg; // 움직인 각도
        var real_angle = n%360 + this.oneItemDeg/2; // 최대 360도라고 잡고 실제 돌아간 각도 + this.oneItemDeg/2( 처음에 한 상품의 절반이 넘어가있으므로 그만큼의 각도를 더해준다 )
        var part = Math.floor(real_angle/this.oneItemDeg); // 해당 배열 index 값

        if(part < 1){
            this.part = part;
            console.log("당첨내역:" + rouletteVal[0] + ", 상품범위:" + part);
            this.imgSet();
           return;
        }

        if(part >= this.rouletteNum){
            this.part = part;
            console.log("당첨내역:" + rouletteVal[rouletteVal.length-1] + ", 상품범위:" + part);
            this.imgSet();
           return;
        }
        this.part = part;
        console.log("당첨내역:" + rouletteVal[part] + ", 상품범위:" + part);
        this.imgSet();
    };

    Sroulette.prototype.imgSet = function () {
        return this.imgSetting();
    };

    return Sroulette;

}($));
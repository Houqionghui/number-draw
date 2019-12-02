(function (doc) {
  let oStartBtn = doc.querySelector('.btn'), // 开始按钮
    oResultNums = doc.querySelector('.ResultNum'), // 随机出来的结果
    oCheckpoint = doc.querySelector('.checkpoints'), // 当前关卡
    oNextPopup = doc.querySelector('#bg_filter'), // 是否进入下一关弹窗
    oNextBtn = doc.querySelector('#confirm'), // 是否进入下一关
    oBackResult = doc.querySelector('#cancel'), // 返回到提现结果页
    oNothing = doc.querySelector('#nothing'), // 什么都没抽着
    oOver = doc.querySelector('.gameOver'), // 结束游戏按钮
    oLastPrice = doc.querySelector('.lastPrice'), // 未中奖时显示
    oTotal = doc.querySelector('#total'), // 已中金额
    oMoney = doc.querySelector('.money'),
    addMoney = doc.querySelector('#addMoney'),
    smallMoney = doc.querySelector('#smallMoney'),
    maxNum = 100, // 能抽到的最大值
    totalPrice = 0, // 最后累加的总金额
    curPrice = 0, // 当前循环到的金额
    curLevel = 1, // 当前关卡
    countdown = null, // 延时
    timer = null, // 计时
    flag = true; // 防止在弹窗出来之前再次点击开始
    flag2=true;

  // 概率 奖励 惩罚列表
  let probability = [70, 67, 64, 61, 58, 55, 52, 49],
  // let probability = [100, 100, 100, 100, 100, 100, 100, 100],
        punishment = [25, 50, 80, 120, 188, 388, 588, 888];
  function init() {
    bindEvent(); // 绑定事件
  }
  function bindEvent() {
    oStartBtn.addEventListener('click', startGame, false);
    oNextBtn.addEventListener('click', closePopup, false);
    oBackResult.addEventListener('click', backPage,  false);
    oOver.addEventListener('click', function () {
      window.location.reload();
    }, false);
  }

  // 开始游戏
  function startGame() {
    // 如果已经在计时了那就停止
        if (timer) {
          clearInterval(timer);
          timer = null;
          oStartBtn.value = '点击开始';
          notSure(curLevel, curPrice);
        } else {
          if (flag) {
            oStartBtn.value = '点击停止';
            timer = setInterval(function () {
              curPrice = Math.floor(Math.random() * (maxNum))+1;
              oResultNums.style.cssText = 'font-size: 90px;'
              oResultNums.innerHTML = autoForma(curPrice);
            }, 50);
            flag = false;
          }
        }
  }

  // 点击继续游戏
  function closePopup() {
    clearTimeout(countdown);
    countdown = null;
    curLevel++;
    // if (curLevel == 8) {
    //   // notSure();
      
    // }
    oCheckpoint.innerHTML = curLevel;
    oNextPopup.style.display = 'none';
    oResultNums.style.cssText = 'font-size: 80px;'
    oResultNums.innerHTML = '00';
  // maxNum -= Math.floor(maxNum / 10);
    flag = true;
  }


  // 符合奖励条件时 把增加的金额当作参数传入 如果不传入 默认为10
  function successful(price = 10) {
    totalPrice = price;
    oTotal.innerHTML = totalPrice; //已中金额
    countdown = setTimeout(function () {
      if(curLevel===8){
        backPage();
      }else{
        oNextPopup.style.display = 'block';
      }
     
    }, 800);
  }

  // 不符合奖励条件时 即游戏结束
  function failure() {
    countdown = setTimeout(function () {
      // 结束游戏
      oLastPrice.innerHTML = curPrice;
      oNothing.style.display = 'block';

      clearTimeout(countdown);
      countdown = null;
    }, 1000);
  }

  /** 方便修改关卡阈值
   * @param { Number } price 每次循环出来的金额
   * @param { Number } level 当前进行的关卡
   * @param { Number } reward 每次奖励的金额
   */
  function notSure(level, price) {
    let popupTipsLevel = probability[level-1], // 小于这个金额才会增加
      popupTipsReward = punishment[level - 1]; // 每次奖励的金额
    if (price <= popupTipsLevel) {
      // 弹窗里大于数字
      oMoney.innerHTML = popupTipsLevel; // 如果大于 xx
      addMoney.innerHTML = punishment[level]; // 增加至 xx 元
      smallMoney.innerHTML = popupTipsLevel; // 如果小于 xx
      successful(popupTipsReward, popupTipsLevel);
    } else {
      failure(popupTipsLevel);
    
    }
  }
  // 返回到结果页
  function backPage() {
    if(flag2){
      console.log(totalPrice);
      sessionStorage.setItem('resultTotalPrice', totalPrice);
      if(curLevel===8){
        $('.boxmonry').html(`
        <div class="total">恭喜您顺利通过所有关卡,您一共获得 <span id="money">${totalPrice}</span>积分</div>
        `)
      }else{
        $('.boxmonry').html(`
        <div class="total"> 恭喜您一共获得 <span id="money">${totalPrice}</span>积分</div>
        `)
      }
     
      $('.againPlay').click(function(){
            window.location.reload();
          })
      $('.wrapper').fadeOut(500)
      $('.contextbox').fadeIn(500)
    }
    flag2 = false;
  }

  // 给小于10的数字加上0
  function autoForma(num) {
    return String(num < 10 ? '0' + num : num);
  }

  init();
}(document));
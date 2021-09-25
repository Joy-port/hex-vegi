const url ="https://hexschool.github.io/js-filter-data/data.json";
const productList = document.querySelector(".show-list");

const inputTxt = document.querySelector(".input-txt");
const inputBtn = document.querySelector(".input-btn");
const resultName = document.querySelector(".result-name");
const selectList = document.querySelectorAll(".select-group");

const tableSortGroup = document.querySelector(".table-title");

let data ; //原始資料
let showData = []; //用來放filter 後的結果

//撈取資料
function getData(){
  axios.get(url)
  .then(function (response) {
   data = response.data.filter( item => item.作物名稱); //需要賦予data 資料
   //renderData(data);
   init(); //非同步
});
}
//預設渲染畫面
function init(){
  productList.innerHTML = `<tr class="table-waiting"><td colspan="7">請輸入並搜尋想比價的作物名稱^＿^</td></tr>`;
  
}

getData();


//更新選染畫面使用函式

function renderData(data){
  
  let str ='';
  data.forEach(item =>{
    let content =`
            <tr>
            <td>${item.作物名稱}</td>
            <td>${item.市場名稱}</td>
            <td>${item.上價}</td>
            <td>${item.中價}</td>
            <td>${item.下價}</td>
            <td>${item.平均價}</td>
            <td>${item.交易量}</td>
            </tr>
            `;
    str += content;

  });
  
  productList.innerHTML = str;
  selectListAll();
}

//btn type 初步篩選資料

const btnGroup = document.querySelector(".btn-group");
const btnCropsType = document.querySelectorAll(".btn-group a");

btnGroup.addEventListener('click', filterCropType, false);


function filterCropType (e){
  e.preventDefault();
  if(e.target.nodeName !== "A"){
    return ;
  };
  
  btnCropsType.forEach(item =>{
    item.classList.remove("active");
    e.target.classList.add("active");
  });
 
  let type = e.target.dataset.type;
  showData = data.filter(function(item ){
    return type === item.種類代碼;
  });
  
  resultName.textContent = e.target.textContent;
  resetSelect();
  
  renderData(showData);
}


//搜尋資料

inputBtn.addEventListener('click',searchCrops, false);
inputTxt.addEventListener('keyup',searchCropsKey, false);

function searchCrops (e){
  //確認點擊位置
  if(inputTxt.value.trim()=== ""){
    inputBtn.setAttribute("class","input-btn");
    return;
  };

  showData = data.filter(item => {
    return item.作物名稱.match(inputTxt.value.trim()) 
 });
  btnCropsType.forEach(item =>{
    item.classList.remove("active");
  });
  
  resultName.textContent = inputTxt.value.trim();
  inputTxt.value = "";
  inputBtn.setAttribute("class","input-btn");
  resetSelect();
  
  if(showData.length === 0){
    let content = `<tr class="table-waiting"><td colspan="7">查詢不到交易資訊QQ</td></tr>`;
    productList.innerHTML = content;
  
    return ;
  };

  

  renderData(showData);
}

//Enter 搜尋
function searchCropsKey (e){
  if(inputTxt.value.trim() ==""){
    return ;
  };
  inputBtn.classList.add("btn-active");
  if(e.key === "Enter"){
    searchCrops(e);
  };
}



//select change 下拉選單 事件監聽
//selectList.addEventListener("change", changeSelect, false);
function selectListAll(){
  selectList.forEach(function(item,index){
    selectList[index].addEventListener("change", changeSelect, false);
  });
}


function changeSelect(e){
  if(showData.length == 0){
  return ;
  };
    switch(e.target.value){
        case "依上價排序":
        sortChange("上價");
         break;
        case "依中價排序":
        sortChange("中價");
         break;
        case "依下價排序":
        sortChange("下價");
         break;
        case "依平均價排序":
        sortChange("平均價");
         break;
        case "依交易量排序":
        sortChange("交易量");
         break;
    }
}

//執行sort 函式
function sortChange(e){
  showData.sort(function(a,b){
    return a[e]-b[e];
  });
  renderData(showData);
}

//進階篩選

tableSortGroup.addEventListener('click', sortTableBytitle, false);

function sortTableBytitle(e){
  if(e.target.nodeName !== "I"){
    return ;
  }else{
    let sortTitle = e.target.dataset.title;
    let sortDirection = e.target.dataset.sort;
    
    if(sortDirection === "up"){
      showData.sort((a,b)=>{
       return a[sortTitle] - b[sortTitle];  //內容物需要研究
      });
      
    }else if(sortDirection === "down"){
      showData.sort((a,b)=>{
    return b[sortTitle] - a[sortTitle];
  });
    };
    
    selectList.forEach(function(item,index){
      selectList[index].value = `依${sortTitle}排序`;
    });
    renderData(showData);
    
  };
  
  
}
//清空selectList
function resetSelect(){
  selectList[0].value = "排序篩選";
  selectList[1].value = "排序";

}
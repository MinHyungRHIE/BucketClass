//////////////////////////////////////////내 프로필 수정관련 함수///////////////////////////////////////////////////////

//1. mypage 페이지 왔을 때 저장되어 있는 data 불러오기.
//2. 내 프로필 정보수정 버튼 클릭하면 입력한 데이터가 저장, 수정된 data 불러오기

//var callpassword;
var memberId;
//var res;

// ====================== 1. MyPage Loading ==========================
//1. MyPage Loading -> 내 정보를 받아서 뿌려줘야 함.
$(document).ready(function () {
    var unmeaningFulData = new Object();
    unmeaningFulData.req = "ohyeah";
    Apis.postRequest('/customer/mypage',unmeaningFulData).then(response => {
        console.log(response);//promise객체로 옴. 이제 그걸 풀어서, 화면에 뿌려줘야함.
        showMypage(response);
    }); //getrequest로 요청보냄. return으로 response=>response.json()으로 받아짐.

}); //MyPage Loading END

// ==================== Tag & Value Mapping =======================
function showMypage(profileData) {
    console.log(profileData);
//    memberId = '${memberId}';
    console.log('===============================')
    console.log(profileData.memberNickname)
    console.log(profileData.memberEmail)
    console.log(profileData.introduce)
    console.log(profileData.memberJoinDate)
    //console.log(profileData.memberPassword);
    console.log('===============================')
    insertValue('memberNickname', profileData.memberNickname);
    insertValue('memberEmail', profileData.memberEmail);

    val3=$("textarea#introduce").val(profileData.introduce);
    //document.getElementById('introduce').value(val3);

    insertText('memberJoinDate', profileData.memberJoinDate);

    // insertProfileImgResource('memberImg', profileData[memberId].memberImg);
    //callPW(profileData.memberPassword);
    //console.log(callPW(profileData.memberPassword));
};

// 1) 단일 값 맵핑
function insertValue(tag, column) {
    if (column == null) {
        document.getElementById(tag).setAttribute('placeholder', '입력하세요');
    } else {
    	if(column != null){
    		 document.getElementById(tag).setAttribute('value', column);
    	}
    }
};

function insertText(tag, column) {
    document.getElementById(tag).appendChild(document.createTextNode(column));
};

// // 2) 프로필 이미지 소스 맵핑 //로직 다시 짜보기(ClassName :콜랙션으로 됨)
// function insertProfileImgResource(tag, column) {
//
//    //document.getElementsByClassName(tag).setAttribute('src', column);
//    document.getElementById(tag).setAttribute('src', column);
//    var id2 = (tag + "1");
//    document.getElementById(id2).setAttribute('src', column);
//    // const imgTag = document.getElementById(tag);
//    // const imgItem = document.createElement('img');
//    // imgItem.setAttribute('src', column);
//    // imgTag.appendChild(imgItem);
// };
// function callPW(column) {
//     callpassword = column;
//     console.log("callPW 함수얌");
//     console.log(callpassword);
//     return callpassword;
// }
//Tag & Data Mapping / END

//=====================================2. MyPage Update=======================================
//MyPage Update Button
document.getElementById('buttonProfile').addEventListener('click', button_myprofile);

function button_myprofile(){
    console.log("체크올 레알 투르 ?");

    if(checkAll() === true){
        var customerMypageObject = new Object();

        customerMypageObject.memberNickname = document.getElementById("memberNickname").value;
        customerMypageObject.memberEmail = document.getElementById("memberEmail").value;
        customerMypageObject.introduce = document.getElementById("introduce").value;

        console.log("수정값 들어왔니");
        console.log(typeof customerMypageObject, customerMypageObject); //수정 버튼 누를 시, 값들이 JSON으로 변환.
        console.log("수정값 들어왔니1");
        Apis.updateCustomerProfile(customerMypageObject).then(response => { //JSON으로 변환된 값들을 DB로 보낸다.
            console.log("수정값 들어왔니22");
            // Apis.getRequest('/customer/mypage').then(response =>{ //updatecustomerProfile함수에서 반환된 값(수정된 mypage 정보)를 다시 뿌려준다.
            //     console.log("수정값 들어왔니33");
                console.log(response);//promise객체로 옴. 이제 그걸 풀어서, 화면에 뿌려줘야함.
                showMypage(response);
            // });
        }); alert("수정 완료!")
    } else
        alert("필수입력 항목의 빈칸을 채워주세요~");

};

////////////////////////////////////////프로필수정 입력 여부 검사///////////////////////////////////////////////////////
function checkAll() {

    if (document.getElementById("memberNickname").value === "") {
        alert("닉네임을 입력하세요!");
        return false;
    }else if (document.getElementById("memberEmail").value === "") {
        alert("이메일을 입력하세요!");
        return false;
    }else if (document.getElementById("introduce").value === "") {
        alert("자기소개를 입력하세요!");
        return false;
    }else
        return true;
}

//자기소개 관련함수//
//자기소개 체크 -> 개인적으로 공부하자~ 왜 함수호출이 안되냐ㅜㅜ
// function checkIntro() {
//     var text = document.getElementById("introduce").value;
//
//     if (text === "") {
//         alert("자기소개를 입력해 주세요!");
//         return false;
//     }else
//         return true;
// };

//자기소개 란 글자수제한 함수: textarea에 입력된 문자의 바이트 수를 체크
function checkByte(form, limitByte) {

    //obj는 받아오는 객체의 값, limitByte 최대 바이트 수. 초과할 수 없음
    //var strValue = form.value();
    var totalByte = 0;
    var note = document.getElementById("introduce").value;
    //var len = 0;
    //var limitByte = 500;

    for (var i = 0; i < note.length; i++) {

        var currentByte = note.charCodeAt(i);//charcodeat은 유니코드 받아오는 거

        if (currentByte > 128) {
            totalByte += 2;
        } else {
            totalByte++;
        }
        // if(totalByte <= limitByte){
        //    len = i + 1;
        // }
    }

    // 현재 입력한 문자의 바이트 수를 체크하여 표시
    $('#introbyte').text(totalByte);


    // 입력된 바이트 수가 limitByte를 초과 할 경우 경고창 및 글자수 제한
    if (totalByte > limitByte / 2) {
        if (confirm(limitByte / 2 + "글자까지 입력 가능합니다.") == true) {

            document.getElementById("introduce").value = note.slice(0, limitByte / 2);
            $('#introbyte').text(limitByte / 2);
            // document.getElementById("introduce").focus();
        }

        //for(var i=0; i<limitByte; i++){
        //form.introduce.value = note.substr(0,limitByte/2);
        //str = strValue.substr(0, len);
        //form.value = str;
        //checkByte(form, 500);
    };
};

//e-mail 관련함수
//e-mail 입력체크
// function checkMail() {
//     var mail = document.getElementById("memberEmail").value;
//
//     if (mail == "") {
//         alert("E-Mail을 입력해 주세요!");
//         return false;
//     }else
//         return true;
// };

function emailValidity(val) {
    // 이메일 유효성 정규식
    var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

    if (regex.test(val) == false) {
        document.getElementById("checkemail").innerHTML = "잘못된 이메일 형식입니다.";
        document.getElementById("checkemail").style.color = "red";
        val.value = "";
        return false;
    }else {
        document.getElementById("checkemail").innerHTML = "";
    }
};

// function checkNickName() {
//     var name = document.getElementById("memberNickname").value;
//
//     console.log("checknickname if 시작전");
//     if (name === "") {
//         alert("닉네임을 입력해 주세요!");
//         return false;
//     } else
//         return true;
// }

function nickValidity(val) {

    // 닉네임 유효성 검사 (영문소문자, 숫자만 허용)
    for (var i = 0; i < val.length; i++) {
        var ch = val.charAt(i);
        if (!(ch >= '0' && ch <= '9') && !(ch >= 'a' && ch <= 'z') && !(ch >= 'A' && ch <= 'Z')) {
            document.getElementById("checknick").innerHTML = "닉네임은 대소문자, 숫자만 입력가능합니다.";
            val.focus();
            return false;
        } else {
            document.getElementById("checknick").innerHTML = "";
        }
    }
    // 닉네임 길이 체크 (4~12자)
    if (val.length < 4 || val.length > 12) {
        document.getElementById("checknick").innerHTML = "닉네임을 4~12자까지 입력해주세요.";
        document.getElementById("checknick").style.color = "red";
        return false;
    } else {
        document.getElementById("checknick").innerHTML = "";
    }
};


/////////////////////////////////////////////비밀번호 관련 함수/////////////////////////////////////////////////////////

//////////////////////////////////////////Update Password//////////////////////////////////////////////////////
document.getElementById('buttonPassword').addEventListener('click', button_password);

function button_password() {

    console.log("여기 들어옴?");
    if (checkWritePW()===true && checkConfirmPW() ===true) {
        console.log("여기 들어옴?22")
        var customerPwUpdateObject = new Object();

        customerPwUpdateObject.memberPassword = document.getElementById("memberPassword").value;
        customerPwUpdateObject.newPassword = document.getElementById("newPassword").value;
        customerPwUpdateObject.checkPassword = document.getElementById("checkPassword").value;

        console.log(typeof customerPwUpdateObject, customerPwUpdateObject);
        console.log("비밀번호를 서버에 보낸다아");

        Apis.patchRequest('/customer/mypage',customerPwUpdateObject).then(response => {
            if(response.res === "success"){
                console.log("비밀번호 변경");
                alert("비밀번호 수정 완료! ");
            }else
                alert("현재 비밀번호를 올바르게 입력하세요!");
        });
    }else{
        alert("비밀번호 수정 오류! 다시 확인해주세요");
    }

};

//현재 비밀번호
// : 입력여부
function checkWritePW(){
    console.log("여기 들어옴?33");

    // const memberPassword = document.getElementById("memberPassword").value;
    // const newPassword = document.getElementById("newPassword").value;
    // const checkPassword = document.getElementById("checkPassword").value;
    //
    // console.log(memberPassword);
    // console.log(newPassword);
    // console.log(checkPassword);
    console.log(document.getElementById("memberPassword").value);
    console.log(document.getElementById("newPassword").value);
    console.log(document.getElementById("checkPassword").value);

    if(document.getElementById("memberPassword").value === ""){
        alert("현재 비밀번호를 입력하세요");
        return false;
    }
    if(document.getElementById("newPassword").value === ""){
        alert("변경할 비밀번호를 입력하세요");
        return false;
    }
    if(document.getElementById("checkPassword").value === ""){
        alert("변경할 비밀번호를 한번 더 입력하세요");
        return false;
    }

    return true;
}

//새 비밀번호 & 새 비밀번호 확인
// : 두 항목 일치 여부
//var checkConfirmPWF = checkConfirmPW();

function checkConfirmPW() {
    console.log("여기 언제 들어옴?33");
    if(document.getElementById("newPassword").value != document.getElementById("checkPassword").value){
        alert("변경할 비밀번호가 일치하지 않습니다.");
        return false;
    }else {
        console.log("변경할 비밀번호 확인 완료");
        return true;
    }
}

/////////////////////////////////////////////새 비밀번호 유효성검사/////////////////////////////////////////////////
function newPwValidity(val) {

    //var newpasswordRegExp = /^[a-zA-z0-9]{4,12}$/; //비밀번호 길이 체크(8~16자 까지 허용)

    if (val.length < 8 || val.length > 16) {
        document.getElementById("new-pw-notify").innerHTML = "비밀번호를 8~16자까지 입력해주세요.";
        document.getElementById("new-pw-notify").style.color = "red";
        return false;
    } else {
        document.getElementById("new-pw-notify").innerHTML = "";
    }
};

function confirmPwValidity(val) {

    if (val.length < 8 || val.length > 16) {
        document.getElementById("confirm-pw-notify").innerHTML = "비밀번호를 8~16자까지 입력해주세요.";
        document.getElementById("confirm-pw-notify").style.color = "red";
        return false;
    } else {
        document.getElementById("confirm-pw-notify").innerHTML = "";
    }
};
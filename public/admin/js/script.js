// button-status

const buttonsStatus = document.querySelectorAll("[button-status]");
if(buttonsStatus.length > 0){
    let url = new URL(window.location.href);

    buttonsStatus.forEach(button =>{
        button.addEventListener("click", ()=>{
            const status = button.getAttribute("button-status");
            
            if(status){
                url.searchParams.set("status", status);
            }else{
                url.searchParams.delete("status");
            }
            window.location.href = url.href;
        });
    });
}

// form search
const formSearch = document.querySelector("#form-search");
if(formSearch){
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (e)=>{
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if(keyword){
            url.searchParams.set("keyword", keyword);
        }else{
            url.searchParams.delete("keyword");
        }
        window.location = url.href;
    });

}


// enfd form search
//pagination
let buttonPagination = document.querySelectorAll("[button-pagination]");
if (buttonPagination.length > 0) {

    let url = new URL(window.location.href);
    
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
            window.location.href = url.href;
        });
    });
}
//end pagination


// checkbox multi

const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti){
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputsId = checkboxMulti.querySelectorAll("input[name='id']");
    
    inputCheckAll.addEventListener("click",()=>{
        if(inputCheckAll.checked){
            inputsId.forEach((input) =>{
                input.checked = true;
            });
        }else{
            inputsId.forEach((input) =>{
                input.checked = false;
            });
        }
    });
    inputsId.forEach((input) =>{
        input.addEventListener("click",()=>{
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;
            console.log(countChecked);
            console.log(inputsId.length);
            if(countChecked == inputsId.length){
                inputCheckAll.checked = true;
            }else{
                inputCheckAll.checked = false;
            }
        })
    })
}
 //checkbox multi


// FORM CHANGE MULTIPLE
// =======================

const formChangeMulti = document.querySelector("[form-change-multi]");

if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const typeChange = e.target.elements.type.value;
        const inputsChecked = document.querySelectorAll("[checkbox-multi] input[name='id']:checked");

        if (inputsChecked.length === 0) {
            alert("Vui lòng chọn ít nhất một mục");
            return;
        }

        const ids = [];
        const inputIds = formChangeMulti.querySelector("input[name='ids']");

        inputsChecked.forEach(input => {
            const id = input.value;

            if (typeChange === "change-position") {
                // Lấy vị trí
                const position = input.closest("tr").querySelector("input[name='position']").value;

                // Định dạng chuẩn id-position
                ids.push(`${id}-${position}`);
            } else {
                // Active / inactive / delete-all chỉ cần id
                ids.push(id);
            }
        });

        inputIds.value = ids.join(",");
        formChangeMulti.submit();
    });
}


 //end form change multiple


 // show alert
 const showAlert = document.querySelector("[show-alert]");
 if(showAlert){
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(()=>{
        showAlert.classList.add("alert-hidden");
    },time);

    closeAlert.addEventListener("click",()=>{
        showAlert.classList.add("alert-hidden");

    });
 }
 //end show alert

//  upload image

const uploadImage = document.querySelector("[upload-image]");
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change",(e)=>{
        const file = uploadImageInput.files[0];
        if(file){
            const reader = new FileReader();
            reader.onload = function(e){
                uploadImagePreview.src = e.target.result;
                uploadImagePreview.style.display = "block";
            }
            reader.readAsDataURL(file);
        }else{
            uploadImagePreview.src = "";
            uploadImagePreview.style.display = "none";
        }
    });
}

// end  upload image


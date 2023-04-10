var currentTab = '#profile';
function changeTab(tab, e, re, re1) {
    console.log(e);
    if(currentTab == tab){
        return;
    }
    $(tab).removeClass('d-none');
    $(currentTab).addClass('d-none');
    $(e).addClass('active');
    $(re).removeClass('active');
    $(re1).removeClass('active');
    currentTab = tab;
}

function logout(){
    document.cookie = "token= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.reload(true);
}

function showOrderDetails(data){
    // console.log(data);
    data = JSON.parse(data);
    let html = ``;
    let c = 1;
    for(let i = 0; i < data.length; i++){
        html += `<tr>
                    <th colspan="5">${data[i].dish_name}</th>
                </tr>`;
        let meta = data[i].meta;
        console.log(meta);
        for(let j = 0; j < meta.length; j++){
            html += `<tr>
                        <td>${j+1}</td>
                        <td>${meta[j].label}</td>
                        <td>${meta[j].quantity}</td>
                        <td>₹${meta[j].price}</td>
                        <td>₹${parseFloat(meta[j].price) * parseFloat(meta[j].quantity)}</td>
                    </tr>`;
        }
        let addons = data[i].addons || undefined;
        if(addons != undefined && addons.length > 0){
            html += `<tr><th colspan="5">Addons</th></tr>`;
            for(let j = 0; j < addons.length; j++){
                html += `<tr>
                            <td>${j+1}</td>
                            <td>${addons[j].name}</td>
                            <td>${1}</td>
                            <td>₹${addons[j].price}</td>
                            <td>₹${addons[j].price}</td>
                        </tr>`;
            }
        }
    }
    $('#orderDetailsBody').html(html);
    $('.modal-content').css('box-shadow', `10px 16px 57px ${screen.width}px #454343ad;`);
    $('#orderDetails').show();
}

function closeModal(){
    $('#orderDetails').hide();
}
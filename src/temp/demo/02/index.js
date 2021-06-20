

function getJWTJSON(shortUrl, jsondata, dataFunction) {
  // if no auth set, try with auth header first
  header = {
    "accept": "application/json",
    "Access-Control-Allow-Origin": "*"
  };
  if (App.jwttoken) header["Authorization"] = "Bearer " + App.jwttoken;
  $.ajax({
    crossDomain: true,
    type: 'GET',
    contentType: "application/json",
    dataType: 'json',
    data: JSON.stringify(jsondata),
    url: WEBSERVER + shortUrl,
    headers: header,
    success: dataFunction,
    fail: function (jqXHR, textStatus, errorThrown) {
      $('#editpaydetails').modal('hide');
      $('#msgdetails')
        .html(
          '<button type="button" class="btn btn-danger">Failed - system is down please contact support desk</button>');
    },
  }).fail(function (msg) {
    /// report error

  });
}

function postJWTJSON(shortUrl, jsondata, dataFunction) {
  $.ajax({
    type: 'POST',
    url: WEBSERVER + shortUrl,
    data: JSON.stringify(jsondata),
    contentType: "application/json",
    dataType: 'json',
    headers: {
      "Authorization": "Bearer " + App.jwttoken,
      "accept": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    success: dataFunction,
    fail: function (jqXHR, textStatus, errorThrown) {
      $('#editjob').modal('hide');
      $('#msgdetails').html('<button type="button" class="btn btn-danger">Failed - system is down please contact support desk</button>');
    },
  }).fail(function () { alert('error') });
}

function newOffer() {
  clearPanel();
  clearBar();
  $('#newofferdiv1').css("display", "block");
  $('#newofferdiv2').css("display", "block");
}

function clearPanel() {
  $("#mainDiv").empty();
  $('#newofferdiv1').css("display", "none");
  $('#newofferdiv2').css("display", "none");
  $('#pretrade').css("display", "none");
  $('#posttrade').css("display", "none");
}

function clearBar() {
  $("#alertbar").empty();
}

function hideMsgs() {
  $('#msgdialog').modal('hide');
}

function myOffers() {
  hideMsgs();
  var postFilter = { fromccy: 1, toccy: 1 }
  var filtStr = '?filt=';//+encodeURI( JSON.stringify(postFilter) )
  getJWTJSON('v1/useroffers.json' + filtStr, "", (offerList) => {
    console.log(offerList);
    clearPanel();
    clearBar();
    // create button
    $('#alertbar').html('<button class="btn btn-success" type="button" onclick="newOffer()"><i class="fas fa-plus"></i></button>');
    console.log(offerList);
    offerList.forEach(k => {
      var payTypes = "";
      k.paymentDetails.forEach(payItem => {
        payTypes += '<span class="badge bg-primary">' + payItem.payType.name + '</span>';
      })

      var islive = '<div data-bs-toggle="tooltip" data-bs-placement="top" title="visibility" style="float: left;" class="form-check form-switch">' +
        '<input class="form-check-input" type="checkbox" onclick="setLive(' + k.id + ')" id="livecheck' + k.id + '" ' + (k.live ? 'checked' : '') + '>' +
        '</div>';
      var delbutton = '<button class="btn btn-sm btn-danger" style="float: right;" type="button" onclick="deleteOffer(' + k.id + ')"><i class="far fa-trash-alt"></i></button>';

      var res = moment(k.created).fromNow();
      $("#mainDiv").append(
        '<div class="card-body zaraCardWhite" id="' + k.id + '">' +
        '<div class="card mb-3"> <div class="card-header">' + islive + '<h5>' + k.fromccy.name + '/' + k.toccy.name + ' ' + delbutton + '</h5></div> (' + res + ') ' + k.status +
        '<div class="card-body">' +
        '<h5 class="card-title">' + k.fromAmount + ' ' + k.fromccy.name + ' => ' +
        k.toAmount + ' ' + k.toccy.name + '</h5>' +
        payTypes +
        '</div>' +
        '</div>' +
        '</div>'
      );
    })
    if (offerList.length == 0) {
      $("#mainDiv").append(
        '<div class="container g-5" ">' +
        '<div class="row row-cols row-cols-lg-2 g-12 g-lg-3">' +
        '<div class="card mb-3"><h5 class="card-header">You dont have any Offers</h5>' +
        '<div class="card-body">' +
        ' Try creating one' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>');
    }
  });
}

/**
  function validateForm(){		
    var crypt = getCryptBuySell();
    var fiat = getFiatSelected();
    var payTypes = getSelectedPayTypes();
    var buyamt = parseFloat($('#amtbuy').val());
    var sellamt = parseFloat($('#amtsell').val()); 
    var exch = buyamt/sellamt;
  	
    //console.log("validateForm "+buyamt+" "+sellamt+" "+exch+"  "+JSON.stringify(fiat))
  	
    if (buyamt>0 && sellamt>0 && exch>0.0 && (crypt)&&(fiat.found)&&payTypes.length>0){		
      $('#offervalid').removeAttr('disabled')
    }else{
      $('#offervalid').attr('disabled',true)
    }
    //$('#details-tab').click();
  }
**/

function validateForm(attrib) {
  const regex = /^[0-9\.]+$/;
  var postObject = {};
  var errorcount = 0
  //var i = 0, len = attrib.length; i < len; i++
  for (const field in attrib) {
    var widget = $('#' + field);
    var widgetval = $('#' + field).val();
    widgetval = widgetval != undefined ? widgetval.trim() : "";
    console.log(field + " => " + widgetval + " " + attrib[field]);
    var fieldError = 0;
    postObject[field] = widgetval;
    switch (attrib[field]) {
      case 'string':
        if (widgetval == "") {
          fieldError += 1
        } break;
      case 'number':
        if (!widgetval.match(regex)) {
          fieldError += 1
        }
        break;
      case 'select':
        if (!widgetval.match(regex)) {
          fieldError += 1
        } else if (Number.parseInt(widgetval) <= 0) {
          fieldError += 1
        }
        break;
      case 'date':
        if (moment(widgetval, [DATE_TIME_FORMAT]).format() == INVALID_DATE) {
          fieldError += 1;
        }
        break;
      case 'checkbox':
        postObject[field] = widget.is(':checked')
        break;
    }
    if (fieldError > 0) {
      // mark in red	
      console.log('field ' + field + ' has problem ' + attrib[field])
      widget.addClass("is-invalid") //background-color:#fdb9bc;
      widget.removeClass("is-valid");
      errorcount += 1
    } else {
      widget.removeClass("is-invalid");
      widget.addClass("is-valid")
    }
  }
  postObject.errorcount = errorcount;
  return postObject;
}

function calcOfferDetails(obj) {
  //console.log("calc "+obj.name)		
  var crypt = getCryptBuySell();
  var fee = 0;
  var exchrate = parseFloat($('#amtbuy').val() / parseFloat($('#amtsell').val()));
  // fees are attached to USDT always!!!!					

  if (crypt.buy) {
    amt = parseFloat($('#amtsell').val());
    fee = FEEPCT * amt;
    $('#exchrate').html(exchrate);
    $('#amtfee').html(fee + 'USDT');
  } else {
    amt = parseFloat($('#amtbuy').val());
    fee = FEEPCT * amt;
    $('#exchrate').html(exchrate);
    $('#amtfee').html(fee + 'USDT');
  }
  $('#amtfee').val(fee);
}

function swapSides() {

  var curr1 = document.getElementById('dropdownCurr1').innerHTML;
  var amount1 = document.getElementById('amtsell').value;
  var curr2 = document.getElementById('dropdownCurr2').innerHTML;
  var amount2 = document.getElementById('amtbuy').value;
  document.getElementById('dropdownCurr1').innerHTML = curr2;
  document.getElementById('amtsell').value = amount2;
  document.getElementById('dropdownCurr2').innerHTML = curr1;
  document.getElementById('amtbuy').value = amount1;

}

function placeOrder() {

  var postObject = {
    fromccyid: 99, toccyid: 99, fromamt: $('#amtsell').val(), toamt: $('#amtbuy').val(),
    feevalue: $('#amtfee').val(), payTypes: []
  }

  postObject.payTypes = getSelectedPayTypes();
  var crypt = getCryptBuySell();
  var fiat = getFiatSelected();

  console.log(JSON.stringify(crypt) + "  " + JSON.stringify(fiat));

  if (crypt.buy) {
    postObject.toccyid = crypt.ccy.id;
    postObject.fromccyid = fiat.ccy.id;
  } else {
    postObject.fromccyid = crypt.ccy.id;
    postObject.toccyid = fiat.ccy.id;
  }

  console.log(JSON.stringify(postObject));
  postJWTJSON('v1/addupdateorder.json', postObject, function (data) {
    $('#msgdialog').modal('show');
    $('#msgtitle').html('Offer Added');
    if (data.statusCode == 0) {
      $('#msgdetails').html('Success - Added Offer <button type="button" onclick="myOffers()" class="btn btn-success"><i class="fas fa-check"></i> OK</button>');
    } else {
      $('#msgdetails').html('<button type="button" class="btn btn-danger">Failed ' + data.msg + '</button>');
    }
    //refreshView();
  });
}

function getSelectedPayTypes() {
  var favorite = [];
  $.each($("input[name='paychk']:checked"), function () {
    favorite.push($(this).val());
  });
  //console.log(favorite);
  return favorite;
}

function getCryptBuySell() {
  var res = {};
  var valFrom = $('#dropdownCurr1').text()
  var valTo = $('#dropdownCurr2').text()
  console.log("valfrom:" + valFrom + " valto:" + valTo);
  // collect the data from the form
  if (App.ccyMap[valFrom].ccyType === 'ERC20')
    res = { buy: false, ccy: App.ccyMap[valFrom] }
  else if (App.ccyMap[valTo].ccyType === 'ERC20')
    res = { buy: true, ccy: App.ccyMap[valTo] };
  return res;
}

function getFiatSelected() {
  var res = { found: false };
  var valFrom = $('#dropdownCurr1').text()
  var valTo = $('#dropdownCurr2').text()
  if (App.ccyMap[valFrom].ccyType === 'Fiat')
    res = { found: true, ccy: App.ccyMap[valFrom] }
  else if (App.ccyMap[valTo].ccyType === 'Fiat')
    res = { found: true, ccy: App.ccyMap[valTo] };
  return res;
}

function pretrade(ordid) {
  clearPanel();
  getJWTJSON('v1/getoffer.json?oid=' + ordid, '', function (puboffer) {
    console.log(puboffer);
    $('#pretrade').css("display", "block");
    thisoffer = puboffer;
    showthisoffer(puboffer)
    showuserpublic(puboffer.userId);
    showuserrecenttrades(puboffer.userId);
    //setOfferPayButtons('paydetail', puboffer.paymentDetails);
    $('#amtsell').val(puboffer.fromAmount);
    $('#amtbuy').val(puboffer.fromAmount);
  });
}

function showthisoffer(k) {
  console.log(k)
  $("#ccytypebuy").html(k.toccy.name)
  $("#ccytypesell").html(k.fromccy.name)

  var meBuyer = !k.buyer;  // if they are not the buyer, we are buyer
  var buySellStr = meBuyer ? 'Buyer' : 'Seller';
  $('#exchrate').html(k.exchRate);
  $("#thisoffer").empty();
  $("#thisoffer")
    .append(
      'You are the ' + buySellStr + '(exch rate:' + k.exchRate + ')'
      + '<br/> Selling '
      + k.toccy.name
      + ' Buying '
      + k.fromccy.name
      + '   '
      + '<button type="button" class="btn btn-info"  style="float: right;" class="btn btn-sm btn-primary font-weight-bold">'
      + k.fromAmount + ' ' + k.fromccy.name
      + ' available</button>');

  setOfferPayButtons('paydetail', k.paymentDetails);
  $('#preamtsell').val(k.toAmount);
  $('#preamtbuy').val(k.fromAmount);
}

function showuserpublic(uid) {
  getJWTJSON('v1/public/getprofilepublic.json?uid=' + uid, function (details) {
    // set up details
    var stars = "";
    for (var x = 1; x <= details.feedback; x++) {
      stars += '<i class="fas fa-star"></i>';
    }
    for (var x = details.feedback; x < 5; x++) {
      stars += '<i class="far fa-star"></i>';
    }
    // console.log(details);
    $("#username").html(details.username);
    $("#blurb").html(details.blurb ? details.blurb : "no blurb yet");
    $("#feedback").html(stars);
    $("#lastseen").html(moment(details.lastseen).fromNow());
    $("#tradecount").html(details.tradecount);
    $("#verified").html(details.verified);
  });
}

function showuserrecenttrades(uid) {
  getJWTJSON('v1/public/userTrades.json?uid=' + uid, function (trades) {
    // set up details
    console.log(trades);
    trades.forEach(k => {
      var res = moment(k.created).fromNow();
      $("#recenttrades").append(
        '<div class="container g-5" id="' + k.id + '">' +
        '<div class="row row-cols row-cols-lg-2 g-12 g-lg-3">' +
        '<div class="card mb-3"><h5 class="card-header">' + k.fromccy.name + '/' + k.toccy.name + '</h5> (' + res + ') ' + k.status +
        '<div class="card-body">' +
        '<h5 class="card-title">' + k.fromAmount + ' ' + k.fromccy.name + '</h5>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'
      );
    })
    if (trades.length == 0) {
      $("#recenttrades").append(
        '<div class="alert alert-warning" role="alert"> no trade history yet</div>');
    }

  });
}

function browseOffers() {
  var postFilter = { fromccy: 1, toccy: 1 }
  var filtStr = '?filt=';//+encodeURI( JSON.stringify(postFilter) );
  getJWTJSON('v1/public/offers.json' + filtStr, "", (offerList) => {
    clearPanel();
    clearBar();

    console.log(offerList);
    offerList.forEach(k => {
      var payItems = "";
      k.paymentDetails.forEach(payitem => {
        payItems += '<div class="col-sm"><span style="text-align:centre" class="badge rounded-pill bg-primary">' + payitem.payType.name + '</span></div>';
      });
      var res = moment(k.updated).fromNow();
      $("#mainDiv").append(
        '<div class="card-body topCard zaraCard" id="' + k.id + '">' +
        '<h5 class="card-header">' + k.fromccy.name + '/' + k.toccy.name + '<span style="float:right;" class="badge rounded-pill bg-info">' + k.userName + '<span></h5> (' + res + ') ' + k.procStatus +
        '<div class="card-body">' +
        '<h5 class="card-title">' + k.fromAmount + ' ' + k.fromccy.name + ' => ' + k.toAmount + ' ' + k.toccy.name + '</h5>' +
        '</div>' +
        '</div>' +
        '<div class="card-body bottomCard zaraCard"> <div class="row">' +
        payItems + '<div class="col-sm"><button style="float:right;" class="btn btn-outline-success" onclick="pretrade(\'' + k.orderId + '\')" >take offer</button></div>' +
        '</div></div>'
      );
    })
    if (offerList.length == 0) {
      $("#mainDiv").append(
        '<div class="card-body zaraCardWhite" ">' +
        '<div class="card mb-3"><h5 class="card-header">No Offers available</h5>' +
        '<div class="card-body">' +
        '</div>' +
        '</div>' +
        '</div>');
    }
  });
}

function setOfferPayButtons(divid, paylist) {
  var idx = 0;
  paylist.forEach(item => {
    $('#' + divid).append(
      '<input type="radio" id="payid_' + idx + '" class="btn-check" onclick="userpay(' + idx + ')" value="' + item.id + '" name="selectedpay" autocomplete="off" >' +
      '<label class="btn btn-outline-primary btn-sm" for="payid_' + idx + '">' + item.name + '</label>'
    );
    idx++;
  });
}

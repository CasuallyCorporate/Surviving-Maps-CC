$(document).ready(function () {
    $('#menubar').load('nav');
    $('#footer').load('footer');
    console.log("top doc ready");
});

const _variantMap = new Map([
        ["STANDARD",1],
        ["GREEN_PLANET",2],
        ["BELOW_BEYOND",3],
        ["BEYOND_GREEN",4],
        ["TITO_GREEN_PLANET",5],
        ["EVANS_GREEN_PLANET",6]
        ]);

let _query = [];
let _query64 = "";

function rowClicked(id, site) {
    console.log(id);
    console.log(site);

    let row = $("#" + id);
    
    if (row.hasClass("selected")) {
        return;
    }
    
    let selected = row.hasClass("selected");
    //console.log("selected = " + selected);

    $('#searchResultTable tbody > tr').removeClass('selected');

    let obj;
    if (selected) {
        obj = {'id': -1};
    } else {
        obj = {'id': JSON.parse(site).id};
        row.addClass('selected');
    }

    getDisplay(obj);
}

function getDisplay(obj) {
    console.log("get Display of site");
    if(!obj || obj.id < 1) {
        return;
    }

    console.log("Site: " + obj.id);

    let display = $("#displayViewer");
    $.ajax({
        type: 'get',
        url: '/getDisplay',
        data: obj,
        success: function (msg) {
            console.log("success display");
            display.html(msg);
        },
        error: function () {
            console.log("failure");
        }
    });
}


function dataTableFormat() {
    console.log("dataTableFormat");
    $('#searchResultTable').dataTable({
        "searching": false,
        "info": false,
        "lengthChange": false,
        "pageLength": 10
    });
}

function resetMultiSelect(multiSelect) {
    console.log("reset MultiSelect");
    let select = $('#' + multiSelect);
    $('#' + multiSelect + ' option:selected').each(function () {
        $(this).prop('selected', false);
    });
    change();
    select.multiselect('refresh');
}

function resetBreakthroughs() {
    console.log("reset Breakthroughs");
    $('#example-reset option:selected').each(function () {
        $(this).prop('selected', false);
    });
    change();
    $('#example-reset').multiselect('refresh');
}

$(document).ready(function () {
    console.log("doc ready");
    reloadMultiSelects();
    dataTableFormat();
    setFormTriggers();
});

function checkEnable(res) {
    console.log("check enable");

    let op = '#' + res + 'Op';
    let select = '#' + res;

    console.log(res);
    if ($(op).val() === "NO_PREFERENCE") {
        console.log("No pref");
        $(select).prop('disabled', true);
    } else {
        console.log("Other");
        $(select).prop('disabled', false);
    }

    console.log($(op).val());
    console.log($(select).prop('disabled'));

    return false;
}

function setFormTriggers() {
    console.log("set form triggers");
    $('#gameVariant').on("change", reloadForm);
    $('#disasters').on("change", change);
    $('#resources').on("change", change);
    $('#example-reset').on("change", change);
    $('#mapDetails').on("change", change);
}

let _dataTableDiv;

function searchData() {
    let form = $("#main_form");
    $("#tablebody").html(loading);
    
    $.ajax({
        type: form.attr('method'),
        url: form.attr('action'),
        data: form.serialize(),
        success: function (msg) {
            successFn(msg);
            _dataTableDiv = msg;
        },
        error: function (xhr) {
            alert("Search Unavailable/ Query Invalid");
            if (!_dataTableDiv) {
                console.log("Cannot reload TableDiv. Likely null");
            }
            else
            {
                $("#tableDiv").html(_dataTableDiv);
                dataTableFormat();
            }
            console.log(xhr.responseText);
        }
    });
}

function fetchData() {
    console.log("fetch data");
    
    $.ajax({
        type: "GET",
        url: "/getdata",
        success: function (msg) {
            successFn(msg);
        },
        error: function () {
            console.log("failure");
        }
    });
}

function successFn(msg) {
    console.log("successFn");
    $("#tableDiv").html(msg);
    dataTableFormat();
    return true;
}

let loading = "<tr>" +
    "<td colspan='11'>" +
    "<div class=\"clearfix\">\n" +
    "  <div class=\"spinner-grow float-center loading-icon\" role=\"status\">\n" +
    "    <span class=\"sr-only\">Loading...</span>\n" +
    "  </div>\n" +
    "</div>" +
    "</td>" +
    "</tr>";

let change = function formChange() {
    console.log("change is formChange");
    console.log("change fn");
    
    getDisplay();
    return false;
};


function checkEnabled() {
    console.log("checkEnabled");
    checkEnable("water");
    checkEnable("concrete");
    checkEnable("metal");
    checkEnable("raremetal");
    checkEnable("meteor");
    checkEnable("coldwaves");
    checkEnable("dustStorm");
    checkEnable("dustDevil");
}

function reloadForm() {
    console.log("reload Form");
    let form = $("#main_form");

    let complex = form.attr('action') === "/complex";
    let url = complex ? "/reloadComplexForm" : "/reloadForm";

    $.ajax({
        type: "GET",
        data: form.serialize(),
        url: url,
        success: function (msg) {
            console.log("success reloadForm");
            // console.log(msg.toString().slice(0, 100))
            $("#formDiv").html(msg);
            if (complex) checkEnabled();

            reloadMultiSelects();
            setFormTriggers();
            change();
        },
        error: function () {
            console.log("failure");
        }
    });
}

function reloadMultiSelects() {
    console.log("reload multiselect");
    let btr = $('#example-reset');
    let nla = $('#landingArea-reset');
    let top = $('#topography-reset');
    let mpn = $('#map-name-reset');

    reloadMultiSelect(btr);
    reloadMultiSelect(nla);
    reloadMultiSelect(top);
    reloadMultiSelect(mpn);

}

function reloadMultiSelect(element) {
    console.log("reload MultiSelect element");

    element.multiselect({
            buttonContainer: '<div class="btn-group w-100" />',
            buttonClass: 'multiselect dropdown-toggle custom-select text-left',
            maxHeight: 200,
            enableFiltering: true
        }
    );

    element.multiselect('refresh');
    element.on("change", change);
}
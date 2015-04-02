$(document).ready(function() {
	if (document.URL.indexOf("SEARCH_TRANSACTIONS_PRE_CLIENT") != -1) {
		generateQif();
	}
});

function generateQif() {
	function getTdText(table, td_num) { return $.trim(table.find("td:eq(" + td_num +")").text()) }

	function get_transactions() {
		var tr = $(".sektion-innehall2:first table:eq(1) tr");
		return tr.slice(1).map(function(){
			return {"date":getTdText($(this), 1), "vendor":getTdText($(this), 2), "amount":getTdText($(this), 5)}
		});
	}

	var transactions = get_transactions();
	
	var data = "!Type:Bank" + "\n";
	transactions.each(function() {
		data += getQifLine(this);
	});
	
	console.log("Generated QIF:\n" + data);
	insertDownloadLink(data);
}

function getQifLine(input) {
	return "D" + input["date"].replaceAll("-", "/") + "\n" +
		"T" + input["amount"].replace(",", ".") + "\n" +
		"P" + input["vendor"] + "\n" +
		"^" + "\n";
}

function insertDownloadLink(data) {
	var filename = "Swedbank-" + new Date().getTime() + ".qif";
	$("#page-nav ul .last").html("<a download=\"" + filename + "\" href=\"data:application/qif;base64," + btoa(data) + "\">Ladda ner QIF</a>")
}

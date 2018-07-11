
var add_new_action = false;
let source_node = null;
let start_add_new_action = function (node)
{
	console.log(node);
	add_new_action = true;
	source_node = node;
}

let end_add_new_action = function (node)
{
	console.log(node);
	add_new_action = false;
	addAction({SOURCE:source_node, TITLE:'Новое действие', DESTINATION:node})
	syncGraph();
	source_node = null;
}
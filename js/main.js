

const ACTIONS = 'ACTIONS';
const TITLE = 'TITLE';
const TEXT = 'TEXT';
const BACKGROUND = 'BACKGROUND';
const IMAGE = 'IMAGE';
const DESTINATION = 'DESTINATION';
const SOURCE = 'SOURCE';
const VALUE = 'value';
const D3_DESTINATION = 'target';
const D3_SOURCE = 'source';
const D3_ID = 'id';

let root_node = null;
let nodes = [];
let actions = [];
let new_action;

let admin_stylesheet = document.createElement('style')
document.body.appendChild(admin_stylesheet);

function set_is_admin(is_admin)
{
	if (is_admin)
	{
		admin_stylesheet.innerHTML = "";
	}
	else
	{
		admin_stylesheet.innerHTML = ".admin-invisible {visibility:hidden;} \n.admin-hidden {display:none;}";
	}
}

function set_root_node(node)
{
	node['root'] = true;
	root_node['root'] = false;
	root_node = node;
}

function get_current_node_index()
{
	let arrayLength = nodes.length;
	for (let i = 0; i < arrayLength; i++) {
		if (nodes[i]['current'])
		{
			return i;
		}
	}
}

function get_current_node()
{
	return nodes[get_current_node_index()];
}

function scanDepth(target_node, depth){
	if (!depth)
	{
		depth = 0;
	}
	target_node['depth'] = depth;
	let target_actions = target_node[ACTIONS];
	for(let i = 0; i < target_actions.length; ++i)
	{
		scanDepth(target_actions[i].DESTINATION, depth + 1);
	}
}

function scanDepthFromRootNode()
{
	for(let i = 0; i < nodes.length; ++i)
	{
		nodes[i]['depth'] = 0;
	}
	if (root_node)
	{
		scanDepth(root_node);
	}
}

function syncGraph(){

}

function addAction(action)
{
	let source = action[SOURCE];
	let destination = action[DESTINATION];

	destination['depth'] = Math.max(source['depth'] + 1, destination['depth']);

	action[D3_SOURCE] = source[D3_ID];
	action[D3_DESTINATION] = destination[D3_ID];
	action['current'] = 0;
	action['passed'] = 0;
	// action[VALUE] = 10;
	console.log('addAction', action);
	source[ACTIONS].push(action);
	actions.push(action);
}

function addNewAction()
{

}

function deleteNode()
{
	// let arrayLength = nodes.length;
	// let target_id = 0;
	// // let actions_to_delete = [];
	// let deleted_node = null;
	// for (let i = 0; i < arrayLength; i++) {
	// 	if (nodes[i]['current'])
	// 	{
	// 		deleted_node = nodes.splice(i, 1)[0];
	// 		break;
	// 	}
	// }
	// console.log(target_id);

	let current_node_index = get_current_node_index();
	let deleted_node = nodes.splice(current_node_index, 1)[0];


	// arrayLength = actions_to_delete.length;
	// for (let i = 0; i < arrayLength; i++) {
	// 	console.log('delete');
	// 	let index = actions.indexOf(actions_to_delete[i]);
	// 	actions.splice(index, 1)[0];
	// 	// break;
	// }

	let actions_to_delete = [];
	arrayLength = actions.length;
	for (let i = 0; i < arrayLength; i++) {
		if (actions[i][DESTINATION] == deleted_node || actions[i][SOURCE] == deleted_node)
		{
			console.log('delete', i);
			// let index = actions.indexOf(actions_to_delete[i]);
			// actions.splice(i, 1)[0];
			actions_to_delete.push(actions[i]);
			// break;
		}
	}

	arrayLength = actions_to_delete.length;
	for (let i = 0; i < arrayLength; i++) {
		let index = actions.indexOf(actions_to_delete[i]);
		actions.splice(index, 1)[0];
	}
}

function addNode(node)
{
	node['group'] = 1;
	node['vx'] = 0;
	node['vy'] = 0;
	node['depth'] = 0;
	node['current'] = 0;

	node['x'] = (Math.random() - 0.5) * 50;
	node['y'] = (Math.random() - 0.5) * 50;

	node[ACTIONS] = []

	node[D3_ID] = nodes.length;
	console.log(nodes);
	nodes.push(node);
}

function addNewNode()
{
	addNode({
		TITLE:'Заголовок сцены', 
		TEXT:'Основной текст сцены',
		IMAGE:place_holder
	})
}

let node_opening = {
	TITLE:'Обложка', 
	TEXT:'Последнее приключение отставного сержанта гражданской обороны США, Питера Дурфилда, '
	+'уволенного с позором, престарелого учителя химии, бывшего когда-то именитым учёным, '
	+'но исключённого из научных кругов за антинаучные увлечения, Генри Холдмана, '
	+'и торговца антиквариатом сомнительного происхождения, Френсиса Мауи.',
	IMAGE:image_opening
};
addNode(node_opening);

let node_shop = {
	TITLE:'Магазинчик антиквариата', 
	TEXT:'Вечером очередного тихого рабочего дня владелец и он же единственный работник маленького магазинчика антиквариата,'
	+' Френсис Мауи, осматривал новые "артефакты", прибывшие час назад. Всё было на месте, даже более того, одна коробка была лишней.'
	+' Он сразу догадася, какая - среди кривых, грубо сколоченных из подручных материалов коробов ярко выделялся небольшой сундучок'
	+' из тёмного дерева, загадочного поблёскивающего в свете единственного не заставленного товаром окна.'
	+' Беглый осмотр показал крепкий замок из почерневшего от времени металла со странного вида замочной скважиной. '
	+' Бесследно заглянуть внутрь явно не получится.',
	IMAGE:image_box
}
addNode(node_shop);
addAction({SOURCE:node_opening, TITLE:'Начать прохождение', DESTINATION:node_shop});

let node_box_open = {
	TITLE:'Тёмный сундучок', 
	TEXT:'Однако, заглянуть внутрь Френсису нестерпимо хотелось, так что вооружившись стамеской и молотком '
	+'он стал атаковать злополучный сундучок. Напрвив стамеску в стык створок нетерпеливый антиквар применил молоток, '
	+'но материал сундучка и не думал поддаваться. Пятнадцать минут спустя стамеска сорвалась и рассекла мистеру Мауи левую руку, '
	+'забрызгав кровью стол, полку с индейскими талисманами и коллекцию католических крестиков и вчерашнюю коробку китайской лапши.'
	+'Несколько капель попали и на ларец.',
	IMAGE:image_open
};
addNode(node_box_open);
addAction({SOURCE:node_shop, TITLE:'Взломать ящичек', DESTINATION:node_box_open});


let node_self_cure = {
	TITLE:'Ошибка', 
	TEXT:'Обработав рану самостоятельно.....',
	IMAGE:image_open
};
addNode(node_self_cure);
addAction({SOURCE:node_box_open, TITLE:'Обработать рану', DESTINATION:node_self_cure});


let node_hospital_cure = {
	TITLE:'Ошибка', 
	TEXT:'Вернувшись поздно веером из травмпункта.....',
	IMAGE:image_open
};
addNode(node_hospital_cure);
addAction({SOURCE:node_box_open, TITLE:'Отправиться в травмпункт', DESTINATION:node_hospital_cure})

let node_report_box = {
	TITLE:'Ошибка', 
	TEXT:'Как порядочный гражданин, Френсис решил сообщить об ошибке в службу доставки. '
	+'Сундучок, конечно, хотелось оставить себе, он выглядел чертовски любопытно, '
	+'образы сокровищ внутри буквально роились в голове Френсиса - древние золотые монеты, '
	+'серебрянная тиара, инкрустированная алмазами, императорский перстень с печатью. '
	+'Мистер Мауи грустно вздохнул и поднял трубку телефона, всё равно'
	+'рано или поздно ошибка вскроется и ларец придётся вернуть.',
	IMAGE:image_open
};
addNode(node_report_box);
addAction({SOURCE:node_shop, TITLE:'Сообщить в службу доставки', DESTINATION:node_report_box})

let node_report_result = {
	TITLE:'Ошибка', 
	TEXT:'Трубку поднял старик Эд, старый знакомый Френсиса. Уяснив суть дела, он начал сетовать на низкую квалификацию'
	+'сотрудников. Френк не был настроен выслушивать нытьё старика и стал выяснять, когда курьёр сможет забрать ... '
	+'Оказалось, до понедельника никакой возможности это сделать нет и ларец заберут только через два дня.',
	IMAGE:image_open
};
addNode(node_report_result);
addAction({SOURCE:node_report_box, TITLE:'Сообщить в службу доставки', DESTINATION:node_report_result})


console.log(nodes);
/*   helpers   */
let clean = function (obj)
{
	while (obj.firstChild) {
	    obj.removeChild(obj.firstChild);
	}
}
let byId = function(id)
{
	return document.getElementById(id);
}

let print = function(value)
{
	console.log(value);
}
/*   helpers   */

let setBackground = function (picture_url)
{
	// byId("background").src = picture_url;
}

let setImage = function (picture_url)
{
	byId("background").src = picture_url;
}

let setText = function (text)
{
	byId("main").innerHTML = text;
}
let setTitle = function (text)
{
	byId("title").innerHTML = text;
}

let createIcon = function (icon_name, visible, hidden)
{
	let new_icon = document.createElement("i");
	new_icon.innerHTML = icon_name;
	new_icon.classList.add("md-icon");
	// new_icon.classList.add("material-icons");
	// new_icon.classList.add("md-dark");
	// new_icon.classList.add("md-48");
	if (visible)
	{
		new_icon.classList.add("admin-invisible");
	}
	if (hidden)
	{
		new_icon.classList.add("admin-hidden");
	}
	return new_icon;
}

let setActions = function (actions)
{
	let actions_container = byId("actions");
	clean(actions_container);
	actions.forEach(function(action, i) {
		let action_a = document.createElement("a");
		// let action_div = document.createElement("div");
		action_a.href = '#';
		print(action);
		action_a.className = "btn btn-primary btn-lg btn-block";
		action_a.innerHTML = action.TITLE;


		let edit_icon = createIcon("create");
		// edit_icon.onclick = function () {alert(1);}
		edit_icon.onclick = function () {editAction(action, action_a);}
		action_a.appendChild(edit_icon); 

		let delete_icon = createIcon("clear");
		// delete_icon.onclick = function () {alert(1);}
		delete_icon.onclick = function () {deleteAction(action);syncGraph();}
		action_a.appendChild(delete_icon); 

		// + '<i class="md-icon admin-hidden" onclick="editAction(action, action_a);">create</i>'
		// + '<i class="md-icon admin-hidden" onclick="deleteAction(i);">clear</i>';
		action_a.onclick = function(){action['passed'] = 1;action['current'] = 0;renderNextNode(action);};
		action_a.onmouseenter = function(){action['current'] = 1;syncGraph();};
		action_a.onmouseleave = function(){action['current'] = 0;syncGraph();};
		// onmouseenter="log(event)" onmouseleave="log(event)"

		// action_div.appendChild(action_a); 
		// actions_container.appendChild(action_div);
		actions_container.appendChild(action_a); 
	});

}
let editAction = function(action, dom_object)
{
	console.log(action);
	console.log(dom_object);

}
let deleteAction = function(action_to_delete)
{
	index_of_action_to_delete = actions.indexOf(action_to_delete);
	console.log("delete", index_of_action_to_delete);
	actions.splice(index_of_action_to_delete, 1);
}

let setScenePictures = function(pictures_decription)
{
	
	let scene = byId("scene");
	while (scene.firstChild) {
	    scene.removeChild(scene.firstChild);
	}

}
let currentNode = nodes[0];
let renderNode = function(node)
{
	setBackground(node.BACKGROUND);
	setImage(node.IMAGE);
	setTitle(node.TITLE);
	setText(node.TEXT);
	setActions(node.ACTIONS);
	// console.log(node);
	currentNode['current'] = 0;
	// node['current'] = 1;
	currentNode = node;
	currentNode['current'] = 1;
	syncGraph();
	// console.log(node);
}

let renderNextNode = function(action)
{
	renderNode(action.DESTINATION);

	// action[SOURCE]['current'] = 0;
	// action[DESTINATION]['current'] = 1;
	// syncGraph();
}
renderNode(nodes[0]);
syncGraph();


let node_test = {
	TITLE:'Тёмный сундучок', 
	TEXT:'Tsst',
	IMAGE:image_open
};
// addAction({SOURCE:node_opening, TITLE:'test', DESTINATION:node_test})
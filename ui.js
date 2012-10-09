/**
 * ui.js
 * Author: Andre Richards
 * Simplified user interface jquery library.
 * October, 2012
 *
 * Quickly set up interface buttons with bound dom elements
 * that respond whenever the appropriate action is triggered.
 *
 * Instructions:
 * create a new button element and give it class 'uibutton'.
 * Set the uiaction attribute to 'action function parameter1 parameter 2...'.
 * Create a responder in a javascript block using 
 * ui.responder('#button_id','#responding_element_id').
 */



function ui()
{
	this.actionList = new Array;	
	this.responderList = new Object;
	ui.prototype.action = function(id, action, fn, args)
	{
		this.selector = '#'+id;
		this.action = action;

		var element = $(this.selector);
		var callback = fn;
		var uiArguments = new Array;

		if(args != null){
			uiArguments = ui.args(args); //skips the first now because it assumes function name;
		}

		$('body').on(this.action,this.selector,function(e){
			var data = window[callback](uiArguments);	
			ui.respond(id,data);

		});
		ui.actionList.push(this);
	}

	// set up a dom responder, that gets bound to ui.action
	ui.prototype.responder = function(action_id,container)
	{
		elem = $(container);
		this.responderList[action_id] = elem;
	}

	ui.prototype.respond = function(id, data)
	{
		elem = this.responderList[id];
		if(id != null && elem != null && data != null)
		{
			// check the data type and handle.
			if(data.type == 'update') elem.html(data.content);

			else if(data.type == 'append') elem.append(data.content);
			else elem.html(data);
		}
	}

	ui.prototype.init = function()
	{
		var buttons = $('.uibutton');
		buttons.each(function(){
			if($(this).attr('uiaction') != null){		

				args 		= ui.args($(this).attr('uiaction'));
				action 		= args[0];
				uifn 		= args[1];
				id 			= $(this).attr('id');

				uiargs 		= '';
				if(args.length > 2)
					for(var i=2;i<args.length;i++)
						uiargs += args[i]+' ';
		
				new ui.action(id,action,uifn,uiargs);
			}
		});
	}

	// convert string arguments to proper 
	// array and function calls.
	ui.prototype.args = function(arguments)
	{
		return arguments.split(' ');
	}

	// Does synchronous ajax request and returns 
	// result, needed for responder to pick up.
	// Expects json data in return.
	ui.prototype.request = function(url, args)
	{
		$.ajaxSetup({async:false});
		var returnData = null;

		$.post(url,args,function(data){ returnData = data; },'json');

		$.ajaxSetup({async:true});
		return returnData;
	}
}

var ui = new ui;
$(document).ready(function(){ui.init();});



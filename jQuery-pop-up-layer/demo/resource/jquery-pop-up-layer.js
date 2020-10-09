$.fn.Layer = function(config) {

	var html = '<div class="layer">' +
		'<h2>title</h2>' +
		'<p>{{text}}</p>' +
		'<input type="button" value="ok">' +
		'</div>';

	function Layer() {
		this.text = config.text;
		this.init();
	}
	Layer.prototype = {
		constructor: Layer,
		init: function() {
			this.initDom();
			this.initEvent();
		},
		initDom: function() {
			var node = document.createElement("div");
			node.innerHTML = html.replace("{{text}}", this.text);
			this.dom = node.childNodes[0];
		},
		initEvent: function() {
			this.dom.addEventListener("click", function(e) {
				if (e.target.tagName === "INPUT") {
					this.hide();
				}
			}.bind(this)); // bind(this)，将函数内部的this指向当前新创建的对象
		},
		hide: function() {
			document.body.removeChild(this.dom);
		},
		show: function() {
			document.body.appendChild(this.dom);
		}
	};

	var layer = new Layer();

	this.on(config.event, function () {
		layer.show();
	});
};
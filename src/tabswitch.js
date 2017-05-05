(function($){
	var Tab = function(tab){
		var _this = this;

		this.tab = tab;

		// 默认配置参数
		this.config = {
			// 用来定义鼠标的触发类型，click or mouseover
			"triggerType": "click", 
			// 用来定义内容切换效果，直接切换 or 淡入淡出
			"effect": "default", 
			// 默认显示第几个菜单
			"invoke": 2, 
			// 定义tab是否自动切换，指定了时间间隔，表示自动切换，并且切换时间为指定时间间隔
			"auto": false 
		}

		// 如果配置参数存在，就拓展默认的配置参数
		if (this.getConfig()) {
			$.extend(this.config, this.getConfig());
		}

		// 保存tab标签列表、对应的内容列表
		this.tabItems = this.tab.find("ul.tab-nav li");
		this.contentItems = this.tab.find(".nav-content-wrapper .content-item");

		// 保存配置参数
		var config = this.config;

		if (config.triggerType === "click") {
			this.tabItems.click(function () {
				_this.invoke($(this));
			});
		} else if (config.triggerType === "mouseover" || config.triggerType !== "click") {
			this.tabItems.mouseover(function () {
				var self = $(this);
				this.timer = window.setTimeout(function () {
					_this.invoke($(self));
				}, 100);
			}).mouseout(function () {
				// 鼠标移出则清除切换，防止移动太快出现混乱
				window.clearTimeout(this.timer);
			});
		}

		// 自动切换功能，当配置了时间，根据时间间隔进行自动切换
		if (config.auto) {
			// 定义一个全局的定时器
			this.timer = null;

			//计数器
			this.loop = 0;
			this.autoPlay();

			this.tab.hover(function () {
				window.clearTimeout(_this.timer);
			}, function () {
				_this.autoPlay();
			});
		}
	};

	Tab.prototype = {
		// 自动轮播
		autoPlay : function () {
			var _this_ = this;
			// 临时保存tab列表
			var tabItems = this.tabItems;
			// tab的个数
			var tabLength = tabItems.size();

			var config = this.config;

			this.timer = window.setInterval(function () {

				_this_.loop++;

				if (_this_.loop >= tabLength){
					_this_.loop = 0;
				}

				tabItems.eq(_this_.loop).trigger(config.triggerType);

			}, config.auto);
		},

		//获取配置参数
		getConfig : function () {

			// 取得tab-nav elem节点上的data-config
			var config = this.tab.attr("data-config");

			// 确保有配置参数
			if (config && config != ""){
				return $.parseJSON(config);
			} else {
				return null;
			}
		},

		// 事件驱动函数
		invoke : function (currentTab) {
			var _this_ = this;

			var index = currentTab.index();

			// tab选中状态
			currentTab.addClass("active").siblings().removeClass("active");

			// 切换对应的内容
			var effect = this.config.effect;
			var conItems = this.contentItems;
			if (effect === "default" || effect !== "fade") {
				conItems.eq(index).addClass("current").siblings().removeClass("current");
			} else if (effect === "fade") {
				conItems.eq(index).fadeIn().siblings().fadeOut();
			}

			// 如果配置了自动切换，则把index 赋值给 loop
			if (this.config.auto) {
				this.loop = index;
			}
		}

	};

	window.Tab = Tab;
})(jQuery)
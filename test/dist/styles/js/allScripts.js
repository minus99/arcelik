//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
(function(){
	var ua = window.navigator.userAgent;
	if( ua.indexOf('MSIE ') > 0 || ua.indexOf('Trident/') > 0 || ua.indexOf('Edge/') > 0 )
		$('html').addClass('ms-ready')
}());

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
$.fn.textWidth = function( text, font ){
    if (!$.fn.textWidth.fakeEl) $.fn.textWidth.fakeEl = $('<span class="textWidth" style="border: none;background: none;font-size: 23px;padding: 0;height: 50px;color: #333;font-style: normal;font-weight: 500;font-family:Gotham Rounded;">').hide().appendTo( document.body );
	var k = text || this.val() || this.text() || this.attr('placeholder');
	k = (k || '').replace(/\ /g, '.');
	/*font = 'normal normal 500 normal 23px / 38px "Gotham Rounded';
    $.fn.textWidth.fakeEl.text( k ).css('font', font || this.css('font'));*/
	$.fn.textWidth.fakeEl.text( k );
    return $.fn.textWidth.fakeEl.width() + 10;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
var translation = {
	compareVld: 'Karşılaştırma için en az 2 ürün seçiniz.',
	serviceListAll: 'Tümü',
	serviceListAllCity: 'Tüm İller',
	serviceListAllCounty: 'Tüm İlçeler',
	infoWindowMap: 'İçerik Yükleniyor',
	locationSearch: 'Lütfen il/ilçe bilginizi giriniz',
	catSearchAlert: 'Lütfen bir kategori seçiniz.',
	error: 'Hata'
}; 
*/

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

/* GENEL SİSTEM HATA FONK. */
function parseSrvFormResponse( o ){
	console.log(o);
	var cls = 'ems-form-err', prts = '.ems-field, tr, li', s = o['IsSuccess'] || '', r = o['Response'] || '', c = o['Controls'] || [], le = c.length, msg = ''; 
	
	if( s ) return false;
	if( r != '' )
		msg = r + ( r.endsWith('\n') ? '' : '\n' );
	
	$( '.' + cls ).removeClass( cls );
	$('.ems-form-err-msg').remove();	
	
	if( le > 0 ){
		for( var i = 0; i < le; ++i ){
			var k = c[ i ], r = k['Response'] || '', ID = k['Id'] || '', e = $('[id="'+ ID +'"]'), m = $('[id="'+ ID.replace(/txt/g, 'lbf') +'"]');
			
			/* label 
			if( m.length > 0 )
				m.addClass( cls ).parent().addClass( cls );*/
			
			/* input */
			if( e.length > 0 )
				e.after('<div class="ems-form-err-msg">'+ r +'</div>').parents( prts ).eq( 0 ).addClass( cls );
			
				
			msg += r + ( r.endsWith('\n') ? '' : '\n' );		
		}
	}
	/*if( msg != '' )
		alert( msg );*/
}

window.alert = function( k ){
	toastr.error(k, ( translation['error'] || 'Hata' ));
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

(function(){
	var e = $('[data-countdown]');
	if( e.length > 0 ){
		Date.prototype.isValid = function(){ return this.getTime() === this.getTime(); };  
		e
		.each(function(){
            var ths = $( this ), c = ths.attr('data-countdown'), d = new Date( c );
			if( d.isValid() )
				ths.find('.countdown').countdown({ format: 'DHM', until: d, alwaysExpire: true, onExpiry: function(){ $( this ).parents('.countdown-wrp').eq( 0 ).addClass('end-campaing'); } });
        });
	}	
}());

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// YENI ADRES EKLEME
var emsAddress = {
	detectEl: function( ID ){ return ID.length > 0 ? true : false; },
	cls: { opened: 'opened', selected: 'selected' },
	el: { wrp: '.ems-page-order-delivery .ems-grid-address, .ems-page-member-address .ems-grid-address', row: '.ems-grid-row', drpWrp: '.ems-grid-address-dropdown', drpSub: '.ems-grid-address-dropdown .sub', drp: '.ems-grid-address-dropdown .dropdown', newAdr: '.add-new-address', diff: '#chkFarkliFatAdrSec', similar: '.similar-address input' },
	control: function(){
		var _t = this, drpWrp = $( _t.el.drpWrp ), sim = $( _t.el.similar );
		if( sim.is(':checked') );
			
	},
	addEvent: function(){
		var _t = this, wrp = $( _t.el.wrp ), drpWrp = $( _t.el.drpWrp ), drp = $( _t.el.drp ), diff = $( _t.el.diff );
		
		/* dropdown aç/kapa span tıklama */
		drp
		.find('> span')
		.bind('click', function(){
			var ths = $( this ), prt = ths.parent();
			if( prt.hasClass('fat-adres-sec') && !drpWrp.hasClass('fat-selected') )
				return false;
			
			if( prt.hasClass( _t.cls['opened'] ) )
				drp.removeClass( _t.cls['opened'] );
			else{
				drp.removeClass( _t.cls['opened'] );
				prt.addClass( _t.cls['opened'] );	
			}	
		});
		
		/* dropdown içerisindeki tes. veya fat. butonlarına tıklanınca ilgili butona tıklatmak */
		drp
		.find('.btnTesAdrSec, .btnFatAdrSec')
		.bind('click', function(){
			var ths = $( this ), prt = ths.parents('.ems-grid-row').eq( 0 ), ind = prt.attr('data-order') || 0, cls = ths.hasClass('btnTesAdrSec') ? '.btnTesAdrSec' : '.btnFatAdrSec', target = $('.ems-grid-address:not(".clone") .ems-grid-row[data-order="'+ ind +'"]').find( cls );
			
			if( target.length > 0 )
				target.get( 0 ).click();
			
			drp.removeClass( _t.cls['opened'] );
			
			prt.addClass( _t.cls['selected'] ).siblings().removeClass( _t.cls['selected'] );
			
			prt.parents('.dropdown').eq( 0 ).find('> span').html( prt.html() );
			
			/* tes. ve fat. adresi aynıysa veya sadece tek adres varsa */
			if( $( _t.el.similar ).is(':checked') || $('.ems-grid-address:not(".clone")').find( _t.el.row ).length == 1  )
				drpWrp.find('.fat-adres-sec > span').html( drpWrp.find('.tes-adres-sec > span').html() || '' );
			
		});
		
		/* farklı adres seç tıklanınca fat. default değerlerine almak */
		diff.bind('change', function(){
			var ths = $( this );
			setTimeout(function(){
				if( ths.is(':checked') ){
					drpWrp.addClass('fat-selected');
					drpWrp.find('.fat-adres-sec > span').html( drpWrp.find('.fat-adres-sec > span').attr('data-text') || '' );
				}else{
					drpWrp.removeClass('fat-selected');
					drpWrp.find('.fat-adres-sec > span').html( drpWrp.find('.tes-adres-sec > span').html() || '' );
				}
			}, 10);
		});
		
		/* fatura adresi teslimat adresi aynı */
		$( _t.el.similar )
		.bind('change', function(){
			var ths = $( this );
			setTimeout(function(){
				
				if( ths.is(':checked') )
					diff.attr('checked', false);
				else
					diff.attr('checked', true);
								
				diff.change();
				
			}, 100);
		});	
	},
	add: function(){
		var _t = this, wrp = $( _t.el.wrp ), drpWrp = $( _t.el.drpWrp ), drp = $( _t.el.drp );
		
		/* order */
		wrp
		.find( _t.el.row )
		.each(function( i ){ 
			var ths = $( this );
				ths.attr('data-order', i);
				if( ths.find('.btnTesAdrSec').length > 0 ) 
					ths.addClass('tes-adr-sec'); 
				if( ths.find('.btnFatAdrSec:not(".unavailableFatAdr")').length > 0 ) 
					ths.addClass('fat-adr-sec'); 
		});
		
		/* clone */
		var c = wrp.clone().addClass('clone');	
			c.find('[id]').removeAttr('id');
			c.find('.btnTesAdrSec[href], .btnFatAdrSec[href]').attr('href', 'javascript:void(0);');
		
		/* dropdown template ekle */
		wrp.before( $( _t.el.drpWrp ) );
		
		/* dropdown sub kapsayıcısına klonlanmış div eklemek, hem teslimat hemde fatura adresine */
		$( _t.el.drpSub ).append( c ).append( $( _t.el.newAdr ).clone() );
		
		/* dropdown span default değerlerini attribute olarak atamak */
		 $( _t.el.drp )
		.find('> span')
		.each(function(){
			var ths = $( this );
        		ths.attr('data-text', ths.html() || '');    
        });	
		
		/* ilk açılışta dropdown seçili getirtme */
		$( document ).ready(function(){ 
			
			setTimeout(function(){
				
				var k = wrp.find('.btnTesAdrSec.emos_selected').parents('[data-order]').attr('data-order') || '';
					k = drpWrp.find('.tes-adres-sec [data-order="'+ k +'"] .btnTesAdrSec');
				if( k.length > 0 )
					k.get( 0 ).click();
				
				k = wrp.find('.btnFatAdrSec.emos_selected').parents('[data-order]').attr('data-order') || '';
				k = drpWrp.find('.fat-adres-sec [data-order="'+ k +'"] .btnFatAdrSec');
				if( k.length > 0 )
					k.get( 0 ).click();
					
				/* sistemin fatura adresi ilk anda seçili gelmezse similar checkbox seçili gelir  */	
				if( $( _t.el.diff ).is(':checked') )
					drpWrp.addClass('fat-selected');
				else
					$( _t.el.similar ).attr('checked', true);	
				
					
			}, 10);
		
		});
		
	},
	init: function(){
		var _t = this;
		if( _t.detectEl( $( _t.el.wrp ) ) ){
			_t.add();
			_t.addEvent();
		}
	}
};

emsAddress.init();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// KERO
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';

$('.btn-search').click(function(){
    $(this).addClass('animated jello').one(animationEnd, function() {
            $(this).removeClass('animated jello');
        });
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// JS LBF

(function($){
	$.fn.extend({
		
		minusSelectBox : function(options, callback){
			
			var defaults = {
				type: 'before',
				customClass: '',
				inside: 'li > a'
			};
			
			var options = $.extend( defaults, options );
			
			return this.each(function(){
		
				var o = options,
					el = $( this ),
					uty = {
						cleanText: function( k ){ return k.replace(/\s+/g, ''); },
						trimText: function( k ){ return k.replace(/(^\s+|\s+$)/g, ''); },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; }
					},
					main = {
						template: {
							wrp: '<select onchange="window.location.href = $(this).val();" class="minusSelectBox {{customClass}}">{{options}}</select>',
							opt: '<option {{customProp}} value="{{value}}">{{name}}</option>' 
						},
						getTemplate: function(){
							var _t = this, htm = '', loc = window.location, pathname = loc.pathname, locH = loc.href, srch = loc.search;
							
							el
							.find( o.inside )
							.each(function(){
								var ths = $( this ), hrf = ths.attr('href') || '', txt = uty.trimText( ths.text() || '' ), prop = '';
								if( hrf == pathname || hrf == locH || hrf == ( pathname + srch ) )
									prop = 'selected';
								
								if( hrf != '' )									
									htm += _t.template.opt.replace(/{{value}}/g, hrf).replace(/{{name}}/g, txt).replace(/{{customProp}}/g, prop);
							});
							
							htm = _t.template.wrp.replace(/{{customClass}}/g, o.customClass).replace(/{{options}}/g, htm);
							
							return htm;
						},
						add: function(){
							var _t = this, typ = o['typ'], htm = _t.getTemplate();
							if( typ == 'append' ) el.append( htm );
							else if( typ == 'prepend' ) el.prepend( htm );
							else if( typ == 'after' ) el.after( htm );
							else el.before( htm );
						},
						initPlugins: function(){
							el.siblings('.minusSelectBox').iStyler({ wrapper:true, customClass: o.customClass });
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( el.find( o.inside ) ) ){
								_t.add();
								_t.initPlugins();
							}
						}
					};
					
					main.init();		
			});
		}
	})
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusGallery: function(options, callback) {
            var defaults = {
				ratioTyp: 1,
				triggerBtn: '[rel="minusGallery"]',
				customClass: ''
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					bdy = $('body'),
					win = $( window ),
					el = $( this ),
					btn = el.find( o.triggerBtn ),
					cls = { loadImg: 'gallery-load-image', ready: 'gallery-ready', animate: 'gallery-animate', closed: 'gallery-closed' },
					items = '',
					currentItems = 0,
					uty = {
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						cssClass: function( o, callback ){
							var _t = this, ID = $( o['ID'] ), k = o['delay'], type = o['type'], cls;
							if( _t.detectEl( ID ) ){
								if( type == 'add' ){
									cls = o['cls'] || ['ready', 'animate'];
									ID.addClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().addClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
								}else{
									cls = o['cls'] || ['animate', 'ready'];
									ID.removeClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().removeClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
								}
							}
						},
						loadImg: function( k, callback ){
							var  _t = this, img = new Image();
							el.addClass( cls['loadImg'] );
							img.onload = function(){
								if( typeof callback !== 'undefined' )
									callback({ typ: 'success', val: this });
								el.removeClass( cls['loadImg'] );	
							};
							img.onerror = function(){  
								if( typeof callback !== 'undefined' )
									callback({ typ: 'error' });
								el.removeClass( cls['loadImg'] );	
							};
							img.src = k;
						}
					},
                    main = {
						scroller: null,
						current: { w: 0, h: 0, r: 0, elem: null },
						destroy: function(){ 
							var _t = this;
								_t.current['w'] = 0;
								_t.current['h'] = 0;
								_t.current['r'] = 0;
								_t.current['elem'] = null;
								items = '';
								currentItems = 0;
								
							if( _t.scroller !== null ){ 
								_t.scroller.destroy();
								_t.scroller = null;
							}
						},
						template: {
							//gallery: '<div class="minus-gallery '+ o.customClass +'"><div class="minus-gallery-inner"><div class="minus-gallery-header"><a class="gallery-close-btn" href="javascript:void(0);"></a><a rel="next" class="gallery-next-btn gallery-nav-btn" href="javascript:void(0);"><i></i></a><a rel="prev" class="gallery-prev-btn gallery-nav-btn" href="javascript:void(0);"><i></i></a></div><div class="minus-gallery-body"><div class="minus-gallery-body-inner"></div></div><div class="minus-gallery-footer"></div></div></div>'
							gallery: '<div class="minus-gallery '+ o.customClass +'"> <div class="minus-gallery-inner"> <div class="minus-gallery-header"><a class="gallery-close-btn icon-close btn-close" href="javascript:void(0);"></a><a rel="next" class="gallery-next-btn icon-arrow-02-r gallery-nav-btn" href="javascript:void(0);"><i></i></a><a rel="prev" class="gallery-prev-btn icon-arrow-02-l gallery-nav-btn" href="javascript:void(0);"><i></i></a></div><div class="minus-gallery-body"> <div class="minus-gallery-body-inner"></div></div><div class="minus-gallery-footer"></div></div></div>'
						},
						adjust: function(){
							var _t = this, ths = _t.current['elem'] || null;
							if( ths !== null ){
								var con = el.find('.minus-gallery'), wt = con.width(), ht = con.height(), ratio = _t.current['r'], wR = 0, hR = 0, k = '';
								
								if( o.ratioTyp == 0 ){
									if( wt / ht >= ratio ){
										wR = ht * ratio;
										hR = ht;
									}else{
										wR = wt;
										hR = wt / ratio;
									}
								}else{
									if ( wt / ht >= ratio ){
										wR = wt;
										hR = wt / ratio;
									}else{
										wR = ht * ratio;
										hR = ht;
									}
								}
								
								k = Math.round( ( wt - wR ) * .5 ) + 'px,' + Math.round( ( ht - hR ) * .5 ) + 'px';
	
								$( ths )
								.parent()
								.width( Math.round( wR ) )
								.height( Math.round( hR ) )
								//.css({ '-webkit-transform': 'translate('+ k +')', '-ms-transform': 'translate('+ k +')', 'transform': 'translate('+ k +')' });	
	
								if( _t.scroller !== null ) 
									setTimeout(function(){ 
										if( isMobile ){
											_t.scroller.zoom(1, 0, 0, 0)
											_t.scroller.scrollTo( Math.round( ( wt - wR ) * .5 ), Math.round( ( ht - hR ) * .5 ) );
										}
										_t.scroller.refresh(); 
									}, 1);				
							}
						},
						animate: function( k ){
							var _t = this;
							if( k == 'opened' )
								uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[cls['ready'], cls['animate']] });
							else
								uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[cls['animate'], cls['ready']] });		
						},
						set: function( k ){						
							var _t = this;
							if( k !== '' )
								uty.loadImg(k, function( d ){
									if( d['typ'] == 'success' ){
										var con = el.find('.minus-gallery-body-inner'), ths = d['val'];
										con.html( ths );
										_t.current['elem'] = ths;
										_t.current['w'] = ths.width;
										_t.current['h'] = ths.height;
										_t.current['r'] = ( _t.current['w'] / _t.current['h'] ).toFixed( 2 );
										_t.adjust();
										_t.animate('opened');
										setTimeout(function(){ 
											_t.initPlugins(); 
											_t.adjust();
										}, 10);
									}
								});
						},
						addEvent: function(){
							var _t = this;
							
							if( uty.detectEl( btn ) )
								btn.bind('click', function( e ){
									e.preventDefault();
									var ths = $( this ), uri = ths.attr('rel') || ths.attr('href') || '';
									if( uri !== '' )
										_t.set( uri );	
								});
							
							el.find('.gallery-close-btn').bind('click', function(){
								bdy.addClass( cls['closed'] );
								setTimeout(function(){
									bdy.removeClass( cls['closed'] ).removeClass( cls['ready'] ).removeClass( cls['animate'] );
									_t.destroy();
								}, 333);								
							});
							
							el.find('.gallery-nav-btn').bind('click', function(){
								var ths = $( this ), rel = ths.attr('rel') || '', le = items.length - 1;
								if( rel !== '' ){
									if( rel == 'next' ) currentItems++;
									if( rel == 'prev' ) currentItems--;
									if( currentItems < 0 ) currentItems = le;
									if( currentItems > le ) currentItems = 0;
									_t.set( items[ currentItems ] );
								}
							});
							
							win.bind('resize', function(){ _t.adjust(); });	
						},
						add: function(){
							el.append( this.template.gallery );
						},
						initPlugins: function(){
							var _t = this;
							if( _t.scroller !== null ) 
								_t.scroller.refresh();
							else		
								_t.scroller = new IScroll(el.find('.minus-gallery-body').get( 0 ), {
									zoom: true,
									scrollX: true,
									scrollY: true,
									mouseWheel: true,
									disablePointer: true,
									wheelAction: isMobile ? 'zoom' : ''
								});
						},
						init: function(){
							var _t = this;
								_t.add();
								_t.addEvent();
						}
					};
				main.init();    
				
				///////// PUBLIC FUNC
				this.loadImg = function( o ){
					items = o['items'] || '';
					
					var m = el.find('.minus-gallery');
					console.log(items)
					if( items != '' ){
						if( items.length > 1 )
							m.removeClass('no-navigation');
						else
							m.addClass('no-navigation');	
					}
					
					if( items != '' )
						main.set( items[ 0 ] );
					else	
						main.set( o['uri'] );  
				};            
            })
        }
    })
})(jQuery, window);

$('body').minusGallery();

(function($) {
    $.fn.extend({
        minusCustomDropDown: function(options, callback) {
            var defaults = { typ: 'text', fnd: '', clickedElem: '> span', items: '> ul li', prts: '.dropdown' };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					el = $( this ),
					clickedElem = el.find( o.clickedElem ),
					items = el.find( o.items ),
					uty = {
						detectEl: function( ID ){ return ID.length > 0 ? true : false; }
					},
                    main = {
						drp: '.dropdown',
						cls: { opened: 'opened', selected: 'selected' },
						addEvent: function(){
							var _t = this, drp = $( _t.drp + ', ' + o.prts ), opCls = _t['cls']['opened'], sCls = _t['cls']['selected'];
							
							clickedElem
							.bind('click', function(){
								var ths = $( this ).parent();
								if( ths.hasClass( opCls ) ) 
									drp.removeClass( opCls );
								else{
									drp.removeClass( opCls );
									ths.addClass( opCls );
								}
							});
							
							items
							.bind('click', function(){
								var ths = $( this ), k = ths.text();
								if( o.fnd != '' && o.typ == 'html' )
									k = ths.find( o.fnd ).html();
																		
									ths.addClass( sCls ).siblings('li').removeClass( sCls ).parents( o.prts ).find( o.clickedElem ).html( k + '<i class="icon icon-angle-down"></i>' );
								drp.removeClass( opCls );
							});
							
							var e = el.find(o.items + '.selected');
							if( uty.detectEl( e ) )
								e.click();
							else
								items.eq( 0 ).click();
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( clickedElem ) && uty.detectEl( items ) )
								_t.addEvent();
						}
					};
				main.init();                
            })
        }
    })
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusMap: function( options, callback ){
            var defaults = {
				begin: 0,
				sysDrpClicked: false,
				gaSend: false
			};
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var opt = options, 
					el = $( this ),
					uty = {
						trimText: function( k ){	return k.replace(/(^\s+|\s+$)/g,'');	},
						cleanText: function( k ){ return k.replace(/\s+/g, ''); },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						setCookie: function( o ){
							var date = new Date(), minutes = o['minutes'] || 15;
								date.setTime( date.getTime() + ( minutes * 60 * 1000 ) );
							$.cookie(o['name'] || '', o['value'] || '', { expires: date, path: '/' });
						},
						getCookie: function( o ){
							return $.cookie( o['name'] || '' );
						},
						ajx: function( o, callback ){
							$.ajax({
								type: o['type'] || 'GET',
								dataType: o['dataType'] || 'html',
								url: o['uri'] || '',
								data : o['param'] || {},
								contentType: o['contentType'] || '',
								error: function( e ){ 
									if( typeof callback !== 'undefined' ) 
										callback({ type: 'error' }); 
								},
								timeout: 30000,
								success:function( d ){ 
									if( typeof callback !== 'undefined' ) 
										callback({ type: 'success', val: d });
								}
							});
						},
						trControl: {
							charMap: {Ç:'c',Ö:'o',Ş:'s',İ:'i',I:'i',Ü:'u',Ğ:'g',ç:'c',ö:'o',ş:'s',ı:'i',ü:'u',ğ:'g'},
							change: function( k ){
								return k.replace(/\s+/g, '').toLowerCase();
							},
							check: function( k ){
								var _t = this, val = k, str_array = val.split('');
								for(var i=0, len = str_array.length; i < len; i++)
									str_array[i] = _t.charMap[ str_array[ i ] ] || str_array[ i ];
								val = str_array.join('');
								return _t.change( val );
							}
						},
						isVisible: '.visibility-control',
						visibleControl: function(){
							var _t = this, b = false;
							if( _t.isVisible !== '' ){
								var e = $( _t.isVisible );
								if( uty.detectEl( e ) )
									if( e.is(':visible') )
										b = true;	
							}
							return b;
						}
					},
					main = {
						btn: el.find('.service-type li'),
						searchBtn: el.find('.search-btn'),
						newSearchBtn: el.find('.new-search-btn'), 
						city: el.find('.city-list'),
						county: el.find('.county-list'),
						serviceList: el.find('.service-list'),
						distanceList: el.find('.distance-list'),
						locationSearch: el.find('.locator-query-input'),
						changeSearch: el.find('.change-search-btn'),
						serviceView: el.find('.service-view li'),
						locationShare: el.find('.location-share-btn'),
						location: null,
						currentLocation: null,
						//currentLocation: { lat: 41.0202218, long: 28.8901934 },
						cls: { selected: 'selected', loading:'ajx-service', drpCustomClass: 'dropdown', drpOpened: 'opened', searchTyp1: 'search-typ-1', searchTyp2: 'search-typ-2', noResult: 'service-no-result', found: 'service-found', view1: 'service-view-list', view2: 'service-view-map', noCoor: 'no-coor', allowLocationBtn: 'allow-share-location-btn' },
						param: { svt: '' },
						clicklable: true,
						template: {
							lnk: '//maps.google.com/maps?q={{coor}}'
						},
						uri: {
							typ1: '/uyeBilgi/ajxUlkeSehir.aspx?brk=aaa&ulk={{ulk}}&shr={{shr}}&ilc={{ilc}}&tip={{tip}}&lang={{lang}}&svt={{svt}}&tum={{tum}}',
							typ2: '/moduls/servis/servisAjx.aspx?brk=bbb&sec=&tip=liste&svt={{svt}}&dst={{dist}}&ulk={{ulk}}&shr={{shr}}&ilc={{ilc}}&lang={{lang}}&lat={{lat}}&long={{long}}&itext='
						},
						getUri: function( o ){
							var _t = this;	
							return _t['uri'][ o['typ'] || 'typ1' ].replace(/{{ulk}}/g, o['ulk'] || 1).replace(/{{shr}}/g, o['shr'] || '').replace(/{{tip}}/g, o['tip'] || '').replace(/{{lang}}/g, lang).replace(/{{svt}}/g, o['svt'] || '').replace(/{{tum}}/g, encodeURIComponent( o['listAll'] || translation['serviceListAll'] || 'Tümü')).replace(/{{dist}}/g, o['dist'] || -1).replace(/{{ilc}}/g, encodeURIComponent( o['ilc'] || '' )).replace(/{{lat}}/g, o['lat'] || '').replace(/{{long}}/g, o['long'] || '');
						},
						loading: function( k ){
							var _t = this;
							if( k == 'add' ){
								_t.clicklable = false;
								el.addClass( _t['cls']['loading'] );
							}else{
								_t.clicklable = true;
								el.removeClass( _t['cls']['loading'] );
							}
						},
						selectBoxToHtml: function( k ){
							var _t = this, e = $('option', k), htm = '<span>'+ $('option:selected', k).text() +'</span><ul>';
							e.each(function(){
								var ths = $( this ), val = ths.val() || '', rel = ths.attr('rel') || '', txt = uty.trimText( ths.text() ), cls = ths.is(':selected') ? _t['cls']['selected'] : '' ;
								htm += '<li class="'+ cls +'" data-val="'+ val +'" data-coor="'+ rel +'"><a href="javascript:void(0)"><span>'+ txt +'</span></li></li>'
							});
							htm += '</ul>';
							return htm;
						},
						clearParam: function( k ){ return k.replace(/<\/SHR_INPUT>/g, '').replace(/<SHR_INPUT>/g, ''); },
						changeHtml: function( ID ){ 
							var _t = this;
							ID = $( ID );
							$('.pServisListe', ID)
							.each(function( i ){
                                var ths = $( this ), k = ths.find('.divServisListe_Telefon');
									ths
									.attr('data-id', i)
									.find('.divServisListe_Koordinat a')
									.removeAttr('onclick');
									 
									if( uty.detectEl( k ) )
										k.html('<a href="tel:'+ uty.cleanText( k.text() ) +'"><span>'+ k.html() +'</span></a>');
									
									k = ths.find('.divServisListe_Email');
									if( uty.detectEl( k ) )
										k.html('<a href="mailto:'+ uty.cleanText( k.text() ) +'"><span>'+ k.html() +'</span></a>');	
									
									k = ths.find('.divServisListe_Koordinat a').attr('href', 'javascript:void(0);').attr('rel') || '';	
									if( k === '' ) 
										ths.addClass( _t['cls']['noCoor'] );
									else
										ths
										.find('.divServisListe_Koordinat a')
										.attr('href', _t.template.lnk.replace(/{{coor}}/g, k.replace('|', ',')))
										.attr('target', '_blank');
										
										
                            })
							.prepend('<span class="distance-service"></span><span class="service-close-btn"><i></i></span>');
							return ID;
						},
						seoDsc: function(){
							var _t = this;
							if( opt.sysDrpClicked ){
								var e = $('.servis_bilgi-dynamic');
								if( uty.detectEl( e ) )
									_t.serviceList.prepend( e );						
							}
						},
						add: function( o ){
							var _t = this, k = _t.clearParam( o['val'] );
							if( o['typ'] == 'city' ) 
								_t.city.find('.dropdown').html( _t.selectBoxToHtml( k ) );
							else if( o['typ'] == 'county' ) 
								_t.county.find('.dropdown').html( _t.selectBoxToHtml( k ) );
							else if( o['typ'] == 'serviceList' ){  
								_t.serviceList.html( _t.changeHtml( k ) );
								_t.seoDsc();	
								_t.contentAddEvent();
								_t.setDistance();
								maps.set();
							}
						},
						distanceFrom: function( o ){
							var _t = this;
							if( _t.currentLocation != null ){
								var	c = { lat1: _t.currentLocation['lat'] || '', lat2: o['lat'] || '', lng1: _t.currentLocation['long'] || '', lng2: o['lng'] || '' },
									R = 6378137,
									dLat = ( c.lat2 - c.lat1 ) * Math.PI / 180,
									dLng = ( c.lng2 - c.lng1 ) * Math.PI / 180,
									a = Math.sin( dLat / 2 ) * Math.sin( dLat / 2 ) +
										Math.cos( c.lat1 * Math.PI / 180 ) * Math.cos( c.lat2 * Math.PI / 180 ) *
										Math.sin( dLng / 2 ) * Math.sin( dLng / 2 ),
									c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1 - a ) ),
									d = R * c;
					
								return d;	
							}
							return null;
						},
						setDistance: function(){
							var _t = this;
							if( _t.currentLocation != null )
								$('.pServisListe', el)
								.each(function( i ){
									var ths = $( this ), k = ths.find('.divServisListe_Koordinat a').attr('rel') || '';
									if( k != '' ){
										k = k.split('|');
										k = _t.distanceFrom( { lat: k[ 0 ], lng: k[ 1 ] } );
										if( k !== null )
											ths.find('.distance-service').html( '<i>' + ( k / 1000 ).toFixed( 1 ) + ' km<\/i>'  );	
									}
								});
						},
						focusContent: function( k ){
							var _t = this, e = $('[data-id="'+ k +'"]', _t.serviceList);
							if( uty.detectEl( e ) )
								e.addClass( _t['cls']['selected'] ).siblings().removeClass( _t['cls']['selected'] );
						},
						clearContent: function(){
							var _t = this;
								_t.serviceList.html('');	
								maps.deleteMarkers();
						},
						contentAddEvent: function(){
							var _t = this;
							$('.pServisListe .divServisListe_Koordinat a', el).unbind('click').bind('click', function( e ){
								if( !uty.visibleControl() ){
									e.preventDefault();
									var ths = $( this ), id = ths.parents('.pServisListe').attr('data-id') || '';
									if( id != '' ){
										maps.focusMarkers( id );
										el.removeClass( _t['cls']['view1'] ).addClass( _t['cls']['view2'] );
									}
								}
							});
							$('.service-close-btn', el).unbind('click').bind('click', function(){
								$( this ).parents('.pServisListe').removeClass( _t['cls']['selected'] );
							});
						},
						sysDrpClicked: function( o ){
							/* Seo metni için sistem dropdownına tıklatmak */
							if( opt.sysDrpClicked ){
								var _t = this, ID = o['ID'], e = ID.hasClass('city-list') ? '#drpSHR_KOD' : '#drpSRV_SEMT',
								e = $( e );
								if( uty.detectEl( e ) )
									e.val( o['val'] || '' ).change();
							}
						},
						drpAddEvent: function(){
							var _t = this, cls = _t['cls']['drpCustomClass'], opCls = _t['cls']['drpOpened'], sCls = _t['cls']['selected'], drp = el.find('.' + cls);
							
							$('.' + cls + ' > span', el)
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ).parent('.' + cls);
								if( ths.hasClass( opCls ) ) drp.removeClass( opCls );
								else{
									drp.removeClass( opCls );
									ths.addClass( opCls );
								}
							});
							
							$('.' + cls + ' > ul li', el)
							.unbind('click')
							.bind('click', function(){
								var ths = $( this ), target = ths.parents('[data-target]').attr('data-target') || '', val = ths.attr('data-val') || '';
									ths.addClass( sCls ).siblings('li').removeClass( sCls ).parents('.' + cls).find('> span').text( ths.text() );
								drp.removeClass( opCls );
								
								_t.sysDrpClicked({ ID: ths.parents('li').eq( 0 ), val: val });
								
								if( _t.clicklable && target != '' ){
									_t.loading('add');
									var uri = _t.getUri({ typ: 'typ1', shr: ths.attr('data-val'), tip: ths.parents('[data-type]').attr('data-type') || '', svt: _t.param['svt'] });
	
									uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' ){											
												_t.add({ typ: target, val: o['val'] });
												_t.loading('remove');
												_t.drpAddEvent();
											}else
												_t.loading('remove');
										});
								}
							});
							
						},
						gaSend: function(){
							var _t = this;
							if( opt.gaSend ){
								var ci = _t.city.find('.' + _t.cls['selected']), co = _t.county.find('.' + _t.cls['selected']);
								if( ( ci.attr('data-val') || '' ) != '' && ( co.attr('data-val') || '' ) != '' ){
									//ga('send', 'event', { eventCategory: uty.trControl.check( co.text() || '' ), eventAction: 'click', eventLabel: uty.trControl.check( ci.text() || '' ) });
									
									// canlıya geçişte devreye alınacak
								}
							}
						},
						searchClicked: function(){
							
							var _t = this, uri = _t.getUri({ typ: 'typ2', shr: _t.city.find('li.selected').attr('data-val') || '', ilc: _t.county.find('li.selected').attr('data-val') || '', svt: _t.param['svt'] });									
							
							if( opt.sysDrpClicked && el.hasClass( _t['cls']['searchTyp1'] ) )
								if( ( $('[id$="hdnSHR_KOD"]').val() || '' ) == '' && decodeURI( $('[id$="hdnSRV_SEMT"]').val() || '' ) == '' ) return false;
							
							if( el.hasClass( _t['cls']['searchTyp2'] ) ){
								if( _t.location !== null )
									uri = _t.getUri({ typ: 'typ2', shr: '', ulk: '', ilc: '', dist: $('.selected', _t.distanceList).attr('data-val') || 2, svt: _t.param['svt'], 'lat': _t.location['lat'], 'long': _t.location['long'] });
								else{
									alert( translation['locationSearch'] );
									return false;
								}
							}
							
							_t.gaSend();
							_t.loading('add');
							uty.ajx({ uri: uri }, function( o ){
								if( o['type'] == 'success' )											
									_t.add({ typ: 'serviceList', val: o['val'] });
								_t.loading('remove');
							});
						},
						addEvent: function(){
							var _t = this;
							
							/* konum paylaş */
							if( navigator.geolocation && window.location.protocol == 'https:' ){
								if( uty.detectEl( _t.locationShare ) ){
									
									var onShareClick = function(){
										var uri = _t.getUri({ typ: 'typ2', shr: '', ulk: '', ilc: '', dist: $('.selected', _t.distanceList).attr('data-val') || 2, svt: _t.param['svt'], 'lat': _t.currentLocation['lat'], 'long': _t.currentLocation['long'] });
										_t.loading('add');
										uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' )											
												_t.add({ typ: 'serviceList', val: o['val'] });
											_t.loading('remove');
										});
									};
									
									el.addClass( _t['cls']['allowLocationBtn'] );
									_t.locationShare.bind('click', function(){
										
										if( _t.currentLocation != null ) onShareClick();
										else										
											navigator.geolocation.getCurrentPosition(function( position ){
												if( position.coords ){
													_t.currentLocation = { 'lat': position.coords['latitude'], 'long': position.coords['longitude'] };
													uty.setCookie({ name: 'myCurrentPosition', value: JSON.stringify( _t.currentLocation ) });
													onShareClick();
												}else
													_t.currentLocation = null;
											});
									});
								}
								
							}
							
							/* servis görünümü: liste - harita */
							if( uty.detectEl( _t.serviceView ) )
								_t.serviceView.bind('click', function(){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( rel !== '' ){
										if( rel == 'list' )
											el.addClass( _t['cls']['view1'] ).removeClass( _t['cls']['view2'] );
										else	
											el.removeClass( _t['cls']['view1'] ).addClass( _t['cls']['view2'] );
									}	
								}).
								eq( 0 )
								.click();							
							
							/*
							translation['serviceListAllCity']: 'Tüm İller',
	translation['serviceListAllCounty']: 'Tüm İlçeler',
							*/
							
							/* yetkili servis - arcelik magazalar */
							if( uty.detectEl( _t.btn ) ){
								var cls = '';
								_t.btn.each(function(){ cls += ( ( $( this ).attr('data-cls') || '' ) + ' '); });
								_t.btn.bind('click', function(){
									var ths = $( this ), rel = ths.attr('rel') || '';
									if( _t.clicklable && rel != '' ){ 
										el.removeClass( cls ).addClass( ths.attr('data-cls') || '' );
										ths.addClass( _t['cls']['selected'] ).siblings('li').removeClass( _t['cls']['selected'] );
										
										var uri = _t.getUri({ typ: 'typ1', tip: 'servisSehir', svt: rel, listAll: translation['serviceListAllCity'] });
										if( opt.sysDrpClicked )
											uri = _t.getUri({ typ: 'typ1', tip: 'servisSehir', svt: rel, shr: ( $('[id$="hdnSHR_KOD"]').val() || '' ), listAll: translation['serviceListAllCity'] });
										
										_t.loading('add');
										_t.param['svt'] = rel;
										uty.ajx({ uri: uri }, function( o ){
											if( o['type'] == 'success' ){
												
												var uri = _t.getUri({ typ: 'typ1', tip: 'servisIlce', svt: rel, listAll: translation['serviceListAllCounty'] });
												
												if( opt.sysDrpClicked )
													uri = _t.getUri({ typ: 'typ1', tip: 'servisIlce', svt: rel, shr: ( $('[id$="hdnSHR_KOD"]').val() || '' ), ilc: decodeURI( $('[id$="hdnSRV_SEMT"]').val() || '' ), listAll: translation['serviceListAllCounty'] });
																								
												_t.add({ typ: 'city', val: o['val'] });
												uty.ajx({ uri: uri }, function( o ){
													if( o['type'] == 'success' ){
														_t.add({ typ: 'county', val: o['val'] });
														_t.loading('remove');
														_t.drpAddEvent();
														_t.clearContent();
														
														if( opt.sysDrpClicked )
															_t.searchClicked();
													}
												});
											}else
												_t.loading('remove');
										});
									}
								});
								
								var id = minusLoc.get('?', 'svt', urlString) || '';
								if( id !== '' ){
									var e = el.find('.service-type li[rel="'+ id +'"]');
									if( uty.detectEl( e ) ){
										/*if( ( e.attr('data-cls') || '' ) == 'arcelik-magazalar' )
											opt.sysDrpClicked = false;*/
											
										e.click();
									}
								}else
									_t.btn
									.eq( opt.begin )
									.click();
							}
							
							/* listele buton; il/ilçe dropdown veya yazarak */
							if( uty.detectEl( _t.searchBtn ) )
								_t.searchBtn.bind('click', function(){
									if( _t.clicklable ){
										if( opt.sysDrpClicked && el.hasClass( _t['cls']['searchTyp1'] ) )
											$('[id$="btnSrvArama"]').get( 0 ).click();
										else
											_t.searchClicked();
									}
								});
						
							/* yazarak arama */
							if( uty.detectEl( _t.locationSearch ) ){
								var location = new google.maps.places.Autocomplete(_t.locationSearch[0], { types: ['geocode'] });
									location.addListener('place_changed', function(){
										var place = location.getPlace();
										if( place.geometry && place.geometry['location'] )
											_t.location = { 'lat': place.geometry.location.lat(), 'long': place.geometry.location.lng() };	
										else{
											_t.locationSearch.val('');
											_t.location = null;
										}
									});
							}
							
							/* arama tipleri arası eçiş için il/ilçe dropdown veya yazarak */
							if( uty.detectEl( _t.changeSearch ) )
								_t.changeSearch.bind('click', function(){
									if( el.hasClass( _t['cls']['searchTyp1'] ) )
										el.removeClass( _t['cls']['searchTyp1'] ).addClass( _t['cls']['searchTyp2'] );
									else	
										el.addClass( _t['cls']['searchTyp1'] ).removeClass( _t['cls']['searchTyp2'] );
								})
								.click();
							
							/* yeniden arama yapmak için başa döndürür */	
							if( uty.detectEl( _t.newSearchBtn ) )
								_t.newSearchBtn.bind('click', function(){
									el.removeClass( _t['cls']['found'] );
								});	
								
							/* body clicked dropdown kapatmak için */	
							$('body, html').bind('click touchstart', function( e ){
								var m = el.find('.' + _t['cls']['drpCustomClass']); 
								if( !m.is( e.target ) && m.has( e.target ).length === 0 )
									m.removeClass( _t['cls']['drpOpened'] );
							});																						
						},
						setCurrentLocation: function(){
							var _t = this, k = uty.getCookie({ name: 'myCurrentPosition' }) || '';
							if( k !== '' )
								_t.currentLocation = JSON.parse( k );
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( _t.city ) && uty.detectEl( _t.county ) ){
								_t.setCurrentLocation();
								_t.addEvent();
							}
						}
					},
					maps = {
						content: '.pServisListe',
						markersArr: [],
						speed: 100,
						zoomout: null,
						zoomin: null,
						map: null,
						infowindow: null,
						googleMarkerClusterer: null,
						mapDiv: el.find('.service-map'),
						settings: {
						  zoom: 14,
						  center: { lat: 41.047346, lng: 28.941292 },
						  mapTypeId: 'roadmap'
						},
						iconSrc: { 'default': '/images/frontend/map_icon.png', 'active': '/images/frontend/map_icon.png', 'my': '/images/frontend/map_icon.png', 'clustering': '/images/frontend/map_icon2.png', 'markerClose': '/images/frontend/close.svg' },
						getPosition: function( k ){
							var _t = this;
							k = k.replace(/\,/, '.').split('|');
							return new google.maps.LatLng( k[ 0 ], k[ 1 ] );
						},
						addMarker: function( o ){
							var _t = this,
								id = o['id'] || '', 
								htm =  o['htm'] || null,
								ico =  o['ico'] || 'default',
								marker = new google.maps.Marker({ id: id, position: o['pos'], map: _t.map, html: htm, title: o['name'], draggable: false, shadow: null, animation: google.maps.Animation.DROP, icon: _t.iconSrc[ ico ] });
								_t.markersArr.push( marker );
								
							google.maps.event.addListener(marker, 'click', function(){
								var ths = this;
								main.focusContent( ths.id );
								_t.infowindow.close();
								_t.moveToPointZoom( ths.position, 14, { x: 0, y: 0 }, function(){
									_t.infowindow.setContent('<div class="marker-customize">' + ths.html + '</div>' );
									_t.infowindow.open( _t.map, ths );
								});
							});
						},
						focusMarkers: function( k ){
							var _t = this;
							if( _t.markersArr.length > 0 ){
								for( i in _t.markersArr ){
									var m = _t.markersArr[ i ];
									if( m.id == k ){
										google.maps.event.trigger(m, 'click');
										break;
									}
								}	
							}
						},
						deleteMarkers: function(){
							var _t = this;
							if( _t.markersArr.length > 0 ){
								for( i in _t.markersArr )
									if( _t.markersArr[ i ] != null ) 
										_t.markersArr[ i ].setMap( null );
								_t.markersArr.length = 0;
								_t.googleMarkerClusterer.clearMarkers();
							}
						},
						set: function(){
							var _t = this, e = el.find( _t.content ), bnd = new google.maps.LatLngBounds(), ck = main.city.find( '.' + main.cls['selected'] ).attr('data-coor') || '';
							
							if( ck != '' )
								bnd.extend( _t.getPosition( ck ) );
							
							_t.control( e );
							_t.deleteMarkers();
								
							e.each(function( i, k ){
                                var ths = $( this ), pos = uty.trimText( $('.divServisListe_Koordinat a', ths).attr('rel') || '' );
								if( pos !== '' ){
									pos = _t.getPosition( pos );
									bnd.extend( pos );
									_t.addMarker({ id: ths.attr('data-id') || '', name: uty.trimText( $('.divServisListe_FirmaAdi', ths).text() || '' ), htm: ths.html(), pos: pos });
								}
							});
							
							_t.googleMarkerClusterer.addMarkers( _t.markersArr );
							
							_t.map.fitBounds( bnd );	
							if( _t.map.getZoom() > 15 ) 
								_t.map.setZoom( 15 );
						},
						clearInt: function(){
							var _t = this;
							if( _t.zoomout != null ) 
								clearInterval( _t.zoomout );
							if( _t.zoomin != null ) 
								clearInterval( _t.zoomin );
						},	
						moveToPointZoom: function( point, zmax, offset, callback ){
							
							var _t = this, currentZoom = _t.map.getZoom(), currentBounds;
								
								_t.clearInt();
								
								_t.zoomout = setInterval(function(){
									currentBounds = _t.map.getBounds();
									if( !currentBounds.contains( point ) ){
										_t.map.setZoom( currentZoom );
										currentZoom--;
									}else{
										
										_t.clearInt();
										
										if(offset){
											var point1 = _t.map.getProjection().fromLatLngToPoint( point ),
												point2 = new google.maps.Point(
													( ( typeof( offset.x ) == 'number' ? offset.x : 0) / Math.pow( 2, zmax ) ) || 0,
													( ( typeof( offset.y ) == 'number' ? offset.y : 0) / Math.pow( 2, zmax ) ) || 0
												);
											point = _t.map.getProjection().fromPointToLatLng( new google.maps.Point( point1.x - point2.x, point1.y + point2.y ) );
										}
						
										_t.map.panTo( point );
										currentZoom = _t.map.getZoom();
										_t.zoomin = setInterval(function(){
											
											if( currentZoom < zmax ){
												_t.map.setZoom( currentZoom );
												currentZoom++;
											}else{
												_t.clearInt();
												if( typeof callback !== 'undefined' ) callback();
											}
						
										}, _t.speed);
									}
						
								}, _t.speed);
						},
						control: function( ID ){
							if( uty.detectEl( ID ) )
								el.addClass( main['cls']['found'] ).removeClass( main['cls']['noResult'] );
							else
								el.removeClass( main['cls']['found'] ).addClass( main['cls']['noResult'] );	
						},
						init: function(){
							var _t = this;	
								_t.map = new google.maps.Map( _t.mapDiv.get( 0 ), _t.settings );
								/*_t.infowindow = new google.maps.InfoWindow({ content: translation['infoWindowMap'] || 'Loading Content...', maxWidth: 350 });	*/
								_t.infowindow = new InfoBubble({
									map: _t.map,
									padding: 12,
									borderWidth: 1,
									hideCloseButton: true,
									borderColor: '#ae191d',
									arrowSize: 10,
									backgroundColor: '#ed1b24',
									shadowStyle: 1,
									borderRadius: 5,
									minWidth: 225,
									maxWidth: 225,
									maxHeight: 215,
									minHeight: 215,
									backgroundClassName: 'ems-InfoBubble'
								});
								
								 _t.infowindow.setCloseSrc( _t.iconSrc['markerClose'] );
								
								_t.googleMarkerClusterer = new MarkerClusterer(_t.map, [], {
									styles: [
										{
											textColor: 'white',
											url: _t.iconSrc['clustering'],
											height: 40,
											width: 30,
											anchor: [10, 0]
										}
									]
								});								
						}
					};
				maps.init();
				main.init();
				
            })
        }
    })
})(jQuery, window);

//$('.footer-map').html('<div class="service-sidebar"> <div class="service-nav"> <ul class="service-view"> <li rel="list"><a href="javascript:void(0);">LİSTE</a></li><li rel="map"><a href="javascript:void(0);">HARİTA</a></li></ul> <ul class="service-type"> <li rel="1932"><a href="javascript:void(0);">YETKİLİ SERVİSLER</a></li><li rel="1931"><a href="javascript:void(0);">ARÇELİK MAĞAZALARI</a></li></ul> <ul class="service-location"> <li class="location-search-input"> <input placeholder="İL / İLÇE" name="query" type="text" class="locator-query-input" autocomplete="off"> </li><li class="city-list" data-target="county" data-type="servisIlce"> <div class="dropdown"><span>Tümü</span> <ul> </ul> </div></li><li class="county-list"> <div class="dropdown"><span>Tümü</span> <ul> </ul> </div></li><li class="distance-list"> <div class="dropdown"><span>SEÇİNİZ</span> <ul> <li data-val="-1"><a href="javascript:void(0)"><span>SEÇİNİZ</span></a></li><li class="selected" data-val="5"><a href="javascript:void(0)"><span>5 KM</span></a></li><li data-val="10"><a href="javascript:void(0)"><span>10 KM</span></a></li><li data-val="15"><a href="javascript:void(0)"><span>15 KM</span></a></li><li data-val="20"><a href="javascript:void(0)"><span>20 KM</span></a></li></ul> </div></li><li class="location-search-btn"><a href="javascript:void(0);" class="search-btn">LİSTELE</a></li><li class="location-change-search"><a href="javascript:void(0);" class="change-search-btn"><span class="type-1">YAZARAK ARAMA...</span><span class="type-1">İL İLÇE İLE ARAMA...</span></a></li><li class="new-search"><a href="javascript:void(0);" class="new-search-btn"><span>Yeni Arama Yap</span></a></li><li class="location-share"><a href="javascript:void(0);" class="location-share-btn"><span>Konum Paylaş</span></a></li></ul></div><div class="service-list"></div></div><div style="width:100%;height:100%;" id="map" class="service-map"></div>');




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// PLUGINS

/* swiper js*/
;(function($) {
		var delay = 0;
		$.fn.translate3d = function(translations, speed, easing, complete) {
			var opt = $.speed(speed, easing, complete);
			opt.easing = opt.easing || 'ease';
			translations = $.extend({x: 0, y: 0, z: 0}, translations);
	
			return this.each(function() {
				var $this = $(this);
	
				$this.css({ 
					transitionDuration: opt.duration + 'ms',
					//transitionTimingFunction: opt.easing,
					transform: 'translate3d(' + translations.x + 'px, ' + translations.y + '%, ' + translations.z + 'px)'
				});
	
				setTimeout(function() { 
					$this.css({ 
						transitionDuration: '0s', 
						//transitionTimingFunction: 'ease'
					});
	
					opt.complete();
				}, opt.duration + (delay || 0));
			});
		};
	})(jQuery);


/*
$('.swiper-inner').find('> ul').addClass('swiper-wrapper').find('> li').addClass('swiper-slide');


$('.swiper-inner').append('<div class="sld-pager"><strong></strong><span></span></div>');


$('.swiper-inner').append('<div class="bx-controls-direction"><a class="bx-prev" href="javascript:void(0);"><i class="icon-arrow-01-l"></i></a><a class="bx-next" href="javascript:void(0);"><i class="icon-arrow-01-r"></i></a></div>');


$('.swiper-inner').append('<div class="bx-pager bx-default-pager"></div>');


$('[data-duration]').attr('data-duration', 5000);*/


(function($){
	$.fn.extend({
		minusSliderSwiper : function(options){
			var defaults = {	};
			
			var option = $.extend( defaults, options );
			
			return this.each(function( e ){
				var o = option,
					ID = $( this ),
					main = {
						start: 0,
						current: null,
						auto: false,
						totalItems: 0,
						cls: { activeVideo: 'video-active', isPause: 'isPause', isPlay: 'isPlay', noControls: 'no-controls', active: 'active', selected: 'selected', noSwiper: 'no-swiper' },
						typ: {
							main: {
								prop: {
									preloadImages: false, 
									lazyLoading: true, 
									loop: true, 
									slidesPerView: 1, 
									paginationClickable: true, 
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									onDiff: function( o ){
										main.parallax.move( o['diff'] || 0 );
									},
                                    onTouchStart: function(){
										main.autoControl.clear();
									},
									onTouchEnd: function(){
										main.autoControl.init();
										main.parallax.end( 0 );
									},
									onSlideChangeStart: function( s ){
										main.disabledVideo();
										main.autoControl.clear();
										main.parallax.end( 100 );
									},	
									onSlideChangeEnd: function( s ){
										main.autoControl.init();	
										main.detectPosition.init();
										main.activeIndex();
									},
									onInit: function(){
										main.detectPosition.init();
										main.activeIndex();
									}				
								}
							},
							news: {
								prop: {
									preloadImages: false, 
									lazyLoading: true,
									loop: true,
									slidesPerView: 'auto',
       								centeredSlides: true,
									spaceBetween: 80,
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager',
									breakpoints: {
										480: {
										  slidesPerGroup: 1,	
										  slidesPerView: 'auto'
										}
								 	},
									onSlideChangeEnd: function(){
										main.detectPosition.init();
										main.activeIndex();
									},
									onInit: function(){
										main.detectPosition.init();
										main.activeIndex();
									}
								}
							},
							alpha: {
								prop: {
									preloadImages: false, 
									lazyLoading: true, 
									slidesPerView: 1, 
									paginationClickable: true, 
									loop: true,
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									onDiff: function( o ){
										main.parallax.move( o['diff'] || 0 );
									},
                                    onTouchStart: function(){
										main.autoControl.clear();
									},
									onTouchEnd: function(){
										main.autoControl.init();
										main.parallax.end( 0 );
									},
									onSlideChangeStart: function( s ){
										main.disabledVideo();
										main.autoControl.clear();
										main.parallax.end( 100 );
									},	
									onSlideChangeEnd: function( s ){
										main.autoControl.init();	
										main.detectPosition.init();
										main.activeIndex();
									},
									onInit: function(){
										main.detectPosition.init();
										main.activeIndex();
									}				
								}
							},
							productdetail: {
								prop: {
									paginationClickable: true,
									preloadImages: false, 
									lazyLoading: true,
									slidesPerView: 1,
									wrapperClass: 'slide-wrp',
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									onSlideChangeStart: function( s ){
										main.disabledVideo();
									},	
									onSlideChangeEnd: function( s ){
										main.activeIndex();
									},
									onInit: function(){
										main.activeIndex();
									}
								}
							},
							insider: {
								prop: {
									slidesPerView: 'auto', 
									preloadImages: false, 
									lazyLoading: true,
									paginationClickable: true, 
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									slidesPerView: 4,
									slidesPerGroup: 4,
									breakpoints: {
										850: {
										  slidesPerView: 3,
										  slidesPerGroup: 3
										},
										480: {
										  slidesPerGroup: 1,	
										  slidesPerView: 'auto'
										}
								 	},
									onSlideChangeEnd: function( s ){
										main.activeIndex();
									},
									onInit: function(){
										main.activeIndex();
									}
								}
							},
							widget: {
								prop: {
									preloadImages: false, 
									lazyLoading: true,
									paginationClickable: true, 
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									slidesPerView: 4,
									slidesPerGroup: 4,
									breakpoints: {
										950: {
										  slidesPerView: 3,
										  slidesPerGroup: 3
										},
										640: {
										  slidesPerView: 2,
										  slidesPerGroup: 2
										},
										480: {
										  slidesPerGroup: 1,	
										  slidesPerView: 'auto'
										}
								 	},
									onSlideChangeEnd: function( s ){
										main.activeIndex();
									},
									onInit: function(){
										main.activeIndex();
									}
								}
							},
							trio: {
								prop: {
									preloadImages: false, 
									lazyLoading: true,
									paginationClickable: true, 
									nextButton: '.bx-next', 
									prevButton: '.bx-prev', 
									pagination: '.bx-pager', 
									slidesPerView: 3,
									slidesPerGroup: 3,
									breakpoints: {
										640: {
										  slidesPerView: 2,
										  slidesPerGroup: 2
										}
								 	},
									onSlideChangeEnd: function( s ){
										main.activeIndex();
									},
									onInit: function(){
										main.activeIndex();
									}
								}
							},
							contentSlide: {
								prop: {
									slidesPerView: 'auto', 
									preloadImages: false, 
									lazyLoading: true,
									paginationClickable: true, 
									pagination: '.bx-pager', 
									onSlideChangeEnd: function( s ){
										main.activeIndex();
										main.detectPosition.init();
									},
									onInit: function(){
										main.activeIndex();
										main.detectPosition.init();
									}									
								}
							}
						},
						addOrder: function( e ){ e.each(function( i, k ){ $( this ).attr('data-order', i); }); },
						lazyImg: function( k ){
							 k
							 .css({'opacity': 0})
							 .attr('src', k.attr('data-original'))
							 .one('load', function(){ 																			 					
								$( this )
								.addClass('load-image')
								.removeClass('lazy-load')
								.stop()
								.animate({ 'opacity': 1 }, 111);
							 });		
						},
						lazy: function( k ){
							var _t = this, img = $('.lazy-load', k);	
							
							if( uty.detectEl( img ) )
								img
								.each(function(){ _t.lazyImg( $( this ) ); });
						},	
						disabledVideo: function(){
							var _t = this, e = $('.swiper-video', ID);
							
							if( uty.detectEl( e ) )
								e
								.each(function(){
									var ths = $( this );
									if( uty.detectEl( $('.youtubePlayer', ths) ) && ths.parents('li').eq( 0 ).hasClass( _t.cls['activeVideo'] ) ){
										ths.off('playerState');
										ths.get( 0 ).stopVideo();
										ths.parents('li').eq( 0 ).add( ID ).removeClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] ).removeClass( _t.cls['activeVideo'] );
										_t.videoIsPlay.clear();
									}
								});
						},
						videoIsPlay:{
							delay: 2000,
							cls: { show: 'show-controller' },
							stm: null,
							clearTm: function(){
								var _t = this;
								if( _t.stm != null )
									clearTimeout( _t.stm );
							},
							clear: function(){
								var _t = this;
								ID.removeClass( _t.cls['show'] );
							},
							init: function( k ){
								var _t = this;
								_t.clearTm();
								ID.addClass( _t.cls['show'] );	
								_t.stm = setTimeout(function(){ _t.clear(); }, _t.delay);
							}
						},
						activeVideo: function(){
							var _t = this, el = ID.find('.swiper-slide-active'), s = $('.youtubePlayer', el);
							if( uty.detectEl( s ) ){
								$('.swiper-video', el)
								.off('playerState')
								.on('playerState', function( events, k ){
									if( k == 'ended' && _t.current !== null )
										_t.current.slideNext();
									else if( k == 'playing' || k == 'buffering' ){ 
										_t.autoControl.clear();
										el.add( ID ).addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
									}else if( k == 'paused' )
										el.add( ID ).removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
								});
							}
						},
						parallax: {
							el: '.layer-wrapper',
							cls: { drag: 'isDraging' },
							stm: null,
							active: 0,
							clear: function(){
								var _t = this;
								if( _t.stm != null )
									clearTimeout( _t.stm );
							},
							move: function( diff ){
								var _t = this, e = ID.find( _t.el ), mx = wt * .5;							
								if( diff >= mx ) diff = mx;
								if( diff <= -mx ) diff = -mx;
							   	e.addClass( _t.cls['drag'] ).translate3d({ x: ( -diff / mx ) * ( mx * .3 ), y: -50 }, 0);
							},
							end: function( k ){
								var _t = this, e = ID.find( _t.el );
								_t.clear();
								_t.stm = setTimeout(function(){ 
									_t.active = ID.find('.swiper-pagination-bullet-active').index();
									e.removeClass( _t.cls['drag'] ).translate3d({ x: 0, y: -50 }, 444); 
								}, k);
							},
							addEvent: function(){
								var _t = this;
								ID.find('.swiper-pagination-bullet').bind('click', function(){
									 var ind = $( this ).index(), k = -250;
									 if( ind >= _t.active ) k = 250;
									 ID.find('.swiper-slide:not(".swiper-slide-active") .layer-wrapper').translate3d({ x: k, y: -50 }, 0);
								})
							},
							init: function(){
								var _t= this;
									_t.addEvent();
							}
						},
						autoControl: {
							stm: null,
							delay: ID.attr('data-duration') || 2500,
							clear: function(){
								var _t = this;
								if( _t.stm != null )
									clearTimeout( _t.stm );
							},
							start: function(){
								var _t = this;
								
								if( main.auto ){
									_t.clear();
									_t.stm = setTimeout(function(){
										if( main.current !== null )
											main.current.slideNext();
									}, _t.delay);	
								}
							},
							init: function(){
								this.start();
							}
						},
						addEvents: function(){
							var _t = this, videoBtn = $('.btn-video-play', ID);
							
							if( uty.detectEl( videoBtn ) ){
								videoBtn.bind('click', function(){
									var ths = $( this ), prt = ths.parents('li'), s = ths.siblings('.swiper-video'), vid = ths.attr('data-video') || '';
									if( vid != '' ){
										prt.addClass( _t.cls['activeVideo'] );
										if( !uty.detectEl( $('.youtubePlayer', s) ) ){
											s.minusPlayer({ videoId: vid, controls: 0, autoplay: isMobile ? 0 : 1, customClass: 'yt-video-player', orientation: 'vertical' });
											prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
										}else{
											var k = s.get( 0 ); 
											if( k.state() ){
												k.pauseVideo();
												prt.removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
											}
											else{
												k.playVideo();
												prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
											}
										}
										_t.activeVideo();
										_t.autoControl.clear();
									}
									
								});
							}
							
							ID
							.find('.type-video')
							.on('click', function(){
								_t.videoIsPlay.init();
							})
						},
						activeIndex: function(){
							var _t = this, act = ID.find('.swiper-slide-active'), ind = parseFloat( act.attr('data-order') || 0 ), e = ID.find('.headline-holder');
							
							/* lazy */
							setTimeout(function(){ _t.lazy( ID.find('.swiper-wrapper [data-order="'+ ind +'"], .swiper-slide.active') );	}, 225);
							
							/* thumb */
							_t.thumbFocused();
							
							/* headline */
							if( uty.detectEl( e ) )
								$('[data-order="'+ ind +'"]', e).addClass( _t.cls['active'] ).siblings('li').removeClass( _t.cls['active'] );
							
							/* pager */
							e = ID.find('.sld-pager');	
							if( uty.detectEl( e ) ){
								e.find('strong').text( ind + 1 );
								e.find('span').text( '/ ' + _t.totalItems );
							}
							
							/* custom dropdown */
							e = ID.find('.ems-custom-dropdown .dropdown-value'); 
							if( uty.detectEl( e ) ){
								e.html( act.attr('data-title') || '' );
								e = ID.find('.ems-custom-dropdown li[data-order="'+ ind +'"]');
								if( uty.detectEl( e ) )
									e.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
							}
						},
						thumbFocused: function(){
							var _t = this, drp = $('.thumb-pager', ID), k = $('.slide-wrp li.swiper-slide-active', ID).attr('data-order') || 0, cls = { opened: 'open', selected: 'selected' };
							
							if( uty.detectEl( drp ) ){						
								drp.find('[data-order="'+ k +'"]').addClass( cls['selected'] ).siblings().removeClass( cls['selected'] );
								if( _t.thumbPager != null ){								
									k = k - 1;
									if( k <= 0 ) k = 0;
									_t.thumbPager.slideTo( k, 333 );
								}
							}
						},
						thumbPager: null,
						customThumb: function(){
							if( !uty.detectEl( $('.thumb-pager', ID) ) ) 	return false;
							var _t = this, drp = $('.thumb-pager', ID), s = $('ul.slide-wrp > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
							s.each(function( i, k ){
								var ths = $( this ), tt = ths.attr('data-thumb') || '', k = i == 0 ? cls['selected'] : '', sty = '', ico = '', attr = '';
								if( ths.hasClass('prd-video') ){
									k += ' prd-video';
									sty = 'style="background-image:url('+ tt +');"';
									attr = 'data-video="'+ ( ths.attr('data-video') || '' ) +'"'; 
								}
								if( tt != '' )
									htm += '<li '+ attr +' '+ sty +' class="swiper-slide '+ k +'" data-order="'+ i +'"><a href="javascript:void(0);"><img src="'+ tt +'" border="0"/></a></li>';
							});
							drp.find('ul').html( htm );
							
							var le = $('li', drp).length;
							
							drp.addClass('item-' + le);
							
							if( le > 4 ){ 
								drp.addClass('pager-active');
								_t.thumbPager = new Swiper(drp.find('.swiper-inner'), {
									direction: 'vertical',
									slidesPerView: 'auto',
									slidesPerGroup: 1,
									paginationClickable: false,
									spaceBetween: 5,
									mousewheelControl: true,
									wrapperClass: 'thumb-wrp', 
									breakpoints: {
										960: {
										  direction: 'horizontal',
										  slidesPerView: 3, 
										}
								 	}	
								});
							}
															
							$('ul li', drp).bind('click', function(){
								var ths = $( this ), k = ths.attr('data-order') || 0;
								_t.current.slideTo( k, 333 );
								ths.addClass( cls['selected'] ).siblings().removeClass( cls['selected'] );
							});			
							
						},
						detectPosition: {
							get: function( k ){
								var b = false,
									padding = 50,
									con = ID.find('.swiper-inner, .ems-prd-list'),
									o1 = { x: con.offset().left, y: con.offset().top, width: con.width() - padding, height: con.height() },
									o2 = { x: k.offset().left, y: k.offset().top, width: k.width(), height: k.height() };  
								if( o1.x < o2.x + o2.width && o1.x + o1.width > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y )
									b = true;       
								
								return b;
							},
							init: function(){
								var _t = this, e = $('.swiper-inner .swiper-wrapper > li, .ems-prd-list .swiper-wrapper > li', ID);
								if( uty.detectEl( e ) )
									setTimeout(function(){
										e
										.removeClass( main.cls['active'] )
										.each(function(){
											var ths = $( this );
											if( _t.get( ths ) )
												ths.addClass( main.cls['active'] );
										});
									}, 222);
							}
						},
						customLargeBtn: function(){
							var _t = this;
							
							ID
							.find('.swiper-slide a')
							.unbind('click')
							.bind('click', function( e ){ 
								e.preventDefault(); 
								var ths = $( this ), k = ths.attr('data-large') || '';
								if( k != '' ){
									var arr = [];
										arr.push( k );	
									ths.parents('li').siblings().each(function(index, element) {
										var ths = $( this ), hrf = ths.find('a').attr('data-large') || ''
                                        if( hrf !== '' )
											arr.push( hrf )
                                    });	
									bdy.get( 0 ).loadImg( { uri: k, items: arr } );
								}
							});
						},
						customDropDown: function(){
							if( !uty.detectEl( $('.ems-custom-dropdown', ID) ) ) 	return false;
							var _t = this, drp = $('.ems-custom-dropdown', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
							s.each(function( i, k ){
								var ths = $( this ), tt = ths.attr('data-title') || '';
								if( tt != '' )
									htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);">'+ tt +'</a></li>';
							});
							drp.find('.ems-sub').html( htm );
							
							$('.ems-custom-dropdown-header a', drp).bind('click', function(){
								var ths = $( this );
								if( drp.hasClass( cls['opened'] ) ) 
									$('.ems-custom-dropdown').removeClass( cls['opened'] );
								else{
									$('.ems-custom-dropdown').removeClass( cls['opened'] );
									drp.addClass( cls['opened'] );
								}	
							});
							
							$('.ems-sub li', drp).bind('click', function(){
								var ths = $( this ), k = parseFloat( ths.attr('data-order') || 0 );
								$('.ems-custom-dropdown').removeClass( cls['opened'] );
								if( main.current != null )
									main.current.slideTo( k + 1 );
								
							});
							
						},
						addControls: function( k ){
							k = k.eq( 0 );
							 
							if( !uty.detectEl( ID.find('.sld-pager') ) )
								k.append('<div class="sld-pager"><strong></strong><span></span></div>'); 
								
							if( !uty.detectEl( ID.find('.bx-controls-direction') ) )
								k.append('<div class="bx-controls-direction"><a class="bx-prev" href="javascript:void(0);"><i class="icon-arrow-01-l"></i></a><a class="bx-next" href="javascript:void(0);"><i class="icon-arrow-01-r"></i></a></div>'); 	
							
							if( !uty.detectEl( ID.find('.bx-pager') ) )
								k.append('<div class="bx-pager bx-default-pager"></div>'); 									
						},
						set: function(){
							var _t = this, typ = 'main', duration = ID.attr('data-duration') || '', s = $('.swiper-wrapper', ID), items = $('> li', s);
								_t.totalItems = items.length;
							
							ID.addClass('total-item-' + _t.totalItems);
							
							
							if( ID.hasClass('swiper-content') ) typ = 'contentSlide';
							else if( ID.hasClass('gift-suggestions-slider') ) typ = 'trio';
							else if( ID.hasClass('news-slider') ) typ = 'news';
							else if( ID.hasClass('thumb-gallery') ) typ = 'productdetail';
							else if( ID.hasClass('swiper-alpha') ) typ = 'alpha';
							else if( ID.hasClass('insider-widget') ) typ = 'insider';
							else if( ID.hasClass('campaign-product-slider') ) typ = 'widget';
							
							if( _t.totalItems > 1 ){
								_t.addOrder( items );
								_t.customDropDown();
								
								var e = ID.find('.swiper-inner');
								if( !uty.detectEl( e ) )
									e = ID;
								_t.addControls( e );
								
								if( !isMobile )
									$('> li a', s)
									.bind('click', function(){
										var hrf = $( this ).attr('href') || '';
										if( hrf != '' && hrf != '#' && hrf != 'javascript:void(0);' && hrf.indexOf('/') != -1 )
											window.location.href = hrf;
									});								
								
								_t.current = new Swiper(ID, _t.typ[ typ ]['prop'] || {});
								
								
								if( typ == 'main' ) main.parallax.init();	
								if( duration !== '' )  main.auto = true;
								main.autoControl.init();				
							}else{
								ID.addClass( _t.cls['noSwiper'] ).find('li').addClass('swiper-slide-active');
								_t.lazy( ID );
							}
							
							_t.customThumb();
							if( typ == 'productdetail' ) _t.customLargeBtn();
						},						
						init: function(){
							var _t = this;
								_t.set(); 
								_t.addEvents();
								
						}
					};
					main.init();
					
					this.adjust = function(){
						main.detectPosition.init(); 
						if( main.current != null )
							main.current.onResize();
					};
					
			});
		}
	});
})(jQuery);


/* bxslider */
(function($){
	$.fn.extend({
		minusSlider : function(options){
			var defaults = {	};
			
			var option = $.extend( defaults, options );
			
			return this.each(function( e ){
				var o = option,
					con = $( this ),
					main = {
						auto: false,
						current: null,
						typ: {
							main: { 
								prop: {
									touchEnabled: isMobile ? true : false,
									nextText: '<i class="icon-arrow-01-r"></i>', 
									prevText: '<i class="icon-arrow-01-l"></i>', 
									mode: 'horizontal', 
									pager: true, 
									adaptiveHeight: true,
									video: true,
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderLoad: function(){ 
										var ths = this;
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
									},
									onSlideBefore: function(){ 
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths );
									},
									onSlideAfter: function(){ 
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							},
							alpha: { 
								prop: {
									touchEnabled: isMobile ? true : false,
									nextText: '<i class="icon-arrow-01-r"></i>', 
									prevText: '<i class="icon-arrow-01-l"></i>', 
									mode: 'fade', 
									pager: true, 
									adaptiveHeight: true,
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderLoad: function(){ 
										var ths = this;
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
									},
									onSlideBefore: function(){ 
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths );
									},
									onSlideAfter: function(){ 
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							},
							news: { 
								prop: { 
									touchEnabled: isMobile ? true : false,
									nextText: '<i class="icon-arrow-01-r"></i>', 
									prevText: '<i class="icon-arrow-01-l"></i>',
									pager: false, 
									slideWidth: 654,
									minSlides: 2,
									maxSlides: 3,
									moveSlides: 1,
									slideMargin: 80,
									adaptiveHeight: true,
									TouchStart: function(){ main['events']['onTouchStart'](); },
									TouchMove: function(){ main['events']['onTouchMove'](); },
									TouchEnd: function(){ main['events']['onTouchEnd'](); },
									onSliderLoad: function(){ 
										var ths = this;
											ths.slides = 3; 
										main['events']['sliderResize']( ths );
										main['events']['sliderLoad']( ths );
										main['events']['sliderControl']( ths );
										
									},
									onSliderResize: function(){
										main['events']['sliderResize']( this );
									},
									onSlideBefore: function(){
										var ths = this;
										main['events']['slideBefore']();
										main['events']['sliderDisabled']('add');
										main['events']['sliderControl']( ths ); 
									},
									onSlideAfter: function(){  
										main['events']['sliderDisabled']('remove');
										main['events']['slideAfter']();
									} 
								} 
							}	
						},
						cls: { activePlugins: 'plugins-active', activeVideo: 'video-active', isPause: 'isPause', isPlay: 'isPlay' },
						addPager: function( ID ){ ID.append('<div class="sld-pager"><strong></strong><span></span></div>'); },
						addOrder: function( ID ){ ID.each(function( i, k ){ $( this ).attr('data-order', i);  }); },
						customThumb: function( ID ){
							if( !uty.detectEl( $('.thumb-pager', ID) ) ) 	return false;
							var _t = this, drp = $('.thumb-pager', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
							s.each(function( i, k ){
								var ths = $( this ), tt = ths.attr('data-thumb') || '';
								if( tt != '' )
									htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);"><img src="'+ tt +'" border="0"/></a></li>';
							});
							drp.find('ul').html( htm );
							
							
							var sld = null, n = drp.find('ul li').length;
							drp.addClass('items-' + n);
							
							if( n > 4 )
								sld = uty.slider({ ID: drp.find('ul'), prop: { nextText: '<i class="icon-arrow-01-b"></i>', prevText: '<i class="icon-arrow-01-t"></i>', mode: 'vertical', infiniteLoop: false, slideWidth: 155, minSlides: 4, maxSlides: 4, moveSlides: 1, slideMargin: 5, pager: false, controls: true } });
								
							$('ul li', drp).bind('click', function(){
								var ths = $( this ), k = ths.attr('data-order') || 0;
								$('.bx-pager a[data-slide-index="'+ k +'"]', ID).click();
								if( sld != null ){
									if( $('.bx-viewport', drp).offset().top != ths.offset().top )
										sld.goToNextSlide();
									else
										sld.goToPrevSlide();	
								}
							});	
								
						},
						customDropDown: function( ID ){
							if( !uty.detectEl( $('.ems-custom-dropdown', ID) ) ) 	return false;
							var _t = this, drp = $('.ems-custom-dropdown', ID), s = $('.swiper-inner > ul > li', ID), htm = '', cls = { opened: 'open', selected: 'selected' };
							s.each(function( i, k ){
								var ths = $( this ), tt = ths.attr('data-title') || '';
								if( tt != '' )
									htm += '<li class="'+ ( i == 0 ? cls['selected'] : '' ) +'" data-order="'+ i +'"><a href="javascript:void(0);">'+ tt +'</a></li>';
							});
							drp.find('.ems-sub').html( htm );
							
							$('.ems-custom-dropdown-header a', drp).bind('click', function(){
								var ths = $( this );
								if( drp.hasClass( cls['opened'] ) ) 
									$('.ems-custom-dropdown').removeClass( cls['opened'] );
								else{
									$('.ems-custom-dropdown').removeClass( cls['opened'] );
									drp.addClass( cls['opened'] );
								}	
							});
							
							$('.ems-sub li', drp).bind('click', function(){
								var ths = $( this ), k = ths.attr('data-order') || 0;
								$('.ems-custom-dropdown').removeClass( cls['opened'] );
								$('.bx-pager a[data-slide-index="'+ k +'"]', ID).click();
							});
							
						},
						lazyImg: function( ID ){
							 ID
							 .css({'opacity': 0})
							 .attr('src', ID.attr('data-original'))
							 .one('load', function(){ 																			 					
								$( this )
								.addClass('load-image')
								.removeClass('lazy-load')
								.stop()
								.animate({ 'opacity': 1 }, 222);
							 });		
						},
						lazy: function( ID ){
							var _t = this, img = $('.lazy-load', ID);	
							if( uty.detectEl( img ) )
								img
								.each(function(){ _t.lazyImg( $( this ) ); });
						},						
						themes: {
							theme: '',
							active: function( k ){
								k = $( k );
								if( uty.detectEl( k ) ){
									var thm = k.attr('data-theme') || '';
									if( thm != '' )
										con.removeClass( _t.theme ).addClass( thm );
								}
							},
							init: function(){
								var _t = this;
									_t.theme = con.find('[data-theme]').map(function(){ return $( this ).attr('data-theme'); }).get().join(' ');
							}
						},
						activeElements: function( o ){
							var arr = [], elem = o['el'], c = o['c'], k = o['k'], mn = c * k, mx = k * ( mn + 1 ); 
								for( var i = mn; i < mx; ++i ){
									var e = $('li[data-order="'+ i +'"]', elem).not('.bx-clone');
									if( uty.detectEl( $('.lazy-load', e) ) )
										arr.push( e );
								}
							return arr;	
						},
						detectVideo: function(){
							var _t = this;
							$('ul li.type-video', con)
							.each(function(){
                                var ths = $( this ), s = $('.swiper-content', ths);
								if( uty.detectEl( $('.youtubePlayer', s) ) ){
									s.off('playerState');
									s.get( 0 ).stopVideo();
									ths.removeClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] ).removeClass( _t.cls['activeVideo'] );
								}
                            });
						},
						activeVideo: function(){
							var _t = this, el = con.find('[aria-hidden="false"]'), s = $('.youtubePlayer', el);
							if( uty.detectEl( s ) ){
								$('.swiper-content', el)
								.off('playerState')
								.on('playerState', function( events, k ){
									if( k == 'ended' && _t.current !== null )
										_t.current.goToNextSlide();
									else if( k == 'playing' || k == 'buffering' ){ 
										_t.autoControl.clear();
										el.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
									}else if( k == 'paused' )
										el.removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
								});
							}
						},
						events: {
							
							onTouchStart: function(){
								main.detectVideo();
								main.autoControl.clear();
							},
							
							onTouchMove: function(){
							
							},
							
							onTouchEnd: function(){
							
							},
							
							slideBefore: function(){
								main.detectVideo();
								main.autoControl.clear();
							},
							
							slideAfter: function(){
								main.activeVideo();
								main.autoControl.init();
							},
							
							sliderDisabled: function( k ){
								setTimeout(function(){
									if( k == 'add' ) con.addClass('disabled');
									else con.removeClass('disabled');
								}, 10);
							},
					
							sliderLoad: function( ths ){
								setTimeout(function(){ 
									$('li.bx-clone', ths).each(function(){ main.lazy( $( this ) ); }); 
									main.autoControl.init();
								}, 0);
							},
					
							sliderControl: function( ths ){
								
								setTimeout(function(){
									
									var pager = con.find('.sld-pager'), act = con.find('[aria-hidden="false"]'), cnt = con.find('.headline-holder'), drp = $('.ems-custom-dropdown', con), thumb = $('.thumb-pager', con), current = ths.getCurrentSlide(), bx = $('.bx-viewport', con);
									
									if( uty.detectEl( cnt ) )
										$('> ul > li[data-order="'+ current +'"]', cnt).addClass('active').siblings('li').removeClass('active');
									
									if( uty.detectEl( pager ) ){
										pager.find('strong').text( current + 1 );
										pager.find('span').text( '/ ' + ths.getSlideCount() );
									}
									
									if( ths.slides !== undefined ) 
										act = main.activeElements({ el: ths, c: current, k: ths.slides });
									
									if( uty.detectEl( bx ) && ths.slides === undefined )	
										bx.height( act.height() );	
										
									if( uty.detectEl( drp ) ){
										var k = $('.ems-custom-dropdown-header a', drp), e = $('.ems-sub li[data-order="'+ current +'"]', drp);
										if( uty.detectEl( k ) && uty.detectEl( e ) ){
											k.html( e.text() );
											e.addClass('selected').siblings('li').removeClass('selected');
										}
									}
									
									if( uty.detectEl( thumb ) ){
										$('li', thumb).removeClass('selected');
										$('li[data-order="'+ current +'"]', thumb).addClass('selected');
									}
									
									if( uty.detectEl( act ) )
										$.each(act, function(){ main.lazy( $( this ) ); });
										
									
									main.themes.active( act );	
										
								}, 0);
							},
					
							sliderResize: function( ths ){
								setTimeout(function(){
									var b = con.find('.bx-wrapper'); 
									b.css('margin-left', ( con.width() - parseFloat( b.css('max-width') ) ) * .5);
								}, 0);
							}
						},
						customLargeBtn: function(){
							var _t = this;
							
							con
							.find('[data-large]')
							.bind('click', function( e ){ 
								e.preventDefault(); 
								var ths = $( this ), k = ths.attr('data-large') || '';
								if( k != '' ){
									var arr = [];
										arr.push( k );	
									ths.parents('li').eq( 0 ).siblings().each(function(index, element) {
										var ths = $( this ), hrf = ths.find('a').attr('data-large') || '';
                                        if( hrf !== '' )
											arr.push( hrf );
                                    });
									bdy.get( 0 ).loadImg( { uri: k, items: arr } );
								}
							});
						},
						set: function( ID ){
							var _t = this, typ = 'main', duration = ID.attr('data-duration') || '';
							if( ID.hasClass('news-slider') ) typ = 'news';
							else if( ID.hasClass('swiper-alpha') ) typ = 'alpha';
							
							if( duration !== '' ) _t.auto = true;
			
							var s = $('.swiper-inner > ul', ID);
							if( $('> li', s).length > 1 ){ 
								ID.addClass( _t['cls']['activePlugins'] );
								_t.addPager( ID.find('.swiper-inner') || ID );
								_t.addOrder( $('> li', s) );
								_t.customDropDown( ID );
								_t.customThumb( ID );
								_t.themes.init();									
								_t.current = s.bxSlider( _t.typ[ typ ]['prop'] || {} );
							}else
								_t.lazy( ID );
								
							_t.customLargeBtn();	
						},
						addEvents: function(){
							var _t = this, videoBtn = $('.btn-video-play', con);
							
							if( uty.detectEl( videoBtn ) ){
								videoBtn.bind('click', function(){
									var ths = $( this ), prt = ths.parents('li'), s = ths.siblings('.swiper-video'), vid = ths.attr('data-video') || '';
									if( vid != '' ){
										prt.addClass( _t.cls['activeVideo'] );
										if( !uty.detectEl( $('.youtubePlayer', s) ) ){
											s.minusPlayer({ videoId: vid, controls: 0, autoplay: isMobile ? 0 : 1, customClass: 'yt-video-player', orientation: 'vertical' });
											prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
											
										}else{
											var k = s.get( 0 );
											if( k.state() ){
												k.pauseVideo();
												prt.removeClass( _t.cls['isPlay'] ).addClass( _t.cls['isPause'] );
											}
											else{
												k.playVideo();
												prt.addClass( _t.cls['isPlay'] ).removeClass( _t.cls['isPause'] );
											}
										}
										_t.activeVideo();
										_t.autoControl.clear();	
									}
								});
							}
						},
						autoControl: {
							stm: null,
							delay: con.attr('data-duration') || 5000,
							clear: function(){
								var _t = this;
								if( _t.stm != null )
									clearTimeout( _t.stm );
							},
							start: function(){
								var _t = this;
								
								if( main.auto ){
									_t.clear();
									_t.stm = setTimeout(function(){
										if( main.current !== null )
											main.current.goToNextSlide();
									}, _t.delay);	
								}
							},
							init: function(){
								this.start();
							}
						},						
						init: function(){
							var _t = this;
								_t.set( con );
								_t.addEvents();
						}
					};
					main.init();
			});
		}
	});
})(jQuery);


(function($) {
    $.fn.extend({
        minusTabMenu: function( options, callback ){
            var defaults = {
				speed: 222,
				easing: 'easeInOutExpo',
				wrp: '> .ems-tab-inner',
				nav: '> .navigation-js',
				con: '> .content-js'
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
				
                var opt = options, 
					el = $( this ),
					wrp = el.find( opt.wrp ),
					main = {
						nav: wrp.find( opt.nav ),
						con: wrp.find( opt.con ),
						cls: { selected: 'selected' },
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						pageScroll: function( k, callback ){
							var _t = this;
							$('html, body').stop().animate({ scrollTop: k }, opt['speed'] , opt['easing'], function(){ 
								if( typeof callback !== 'undefined' )
									callback();  
							});
						},
						getNavigationTemplate: function(){
							var _t = this, htm = '';
							$('> li', _t.con).each(function(){
								var ths = $( this ), rel = ths.attr('rel') || '', e = ths.find('> a');
								htm += '<li rel="'+ rel +'"><a href="javascript:void(0);">'+ e.html() +'</a></li>';
							});
							return htm;	
						},
						setNavigation: function(){
							var _t = this;
							if( _t.detectEl( _t.nav ) )
								if( !_t.detectEl( $('li', _t.nav) ) )
									_t.nav.html( _t.getNavigationTemplate() );
						},
						addEvent: function(){
							var _t = this;
							$('> li', _t.nav).bind('click', function(){
								var ths = $( this ), rel = ths.attr('rel') || '';
								if( rel != '' ){
									$('> li[rel="'+ rel +'"]', _t.con).add( ths ).addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
									_t.setResize();
								}
							});
							$('> li > a', _t.con).bind('click', function(){
								var ths = $( this ).parent('li'), rel = ths.attr('rel') || '';
								if( rel != '' ){
									if( ths.hasClass( _t.cls['selected'] ) )
										$('> li[rel="'+ rel +'"]', _t.nav).add( ths ).removeClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
									else{
										$('> li[rel="'+ rel +'"]', _t.nav).add( ths ).addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
										_t.pageScroll( ths.offset().top - 60 );
										_t.setResize();	
									}
								}
							});
						},
						setResize: function(){
							setTimeout(function(){ win.resize(); }, 10);
						},
						init: function(){
							var _t = this;
							if( _t.detectEl( _t.con ) ){
								_t.setNavigation();
								_t.addEvent();
							}
						}
					};
				main.init();
				
            })
        }
    })
})(jQuery, window);

(function($) {
    $.fn.extend({
        minusMenu: function(options, callback) {
            var defaults = {
				closeElem: '',
				items: '> ul > li',
				siblings: 'li',
				controls: '> ul, > div',
				customClass: 'selected',
				openedDelay: 200,
				closedDelay: 555,
				eventType: 'hover',
				clickedElem: '> a',
				bdyClicked: false,
				isVisible: '',
				setPos: false,
				overlay: false,
				bdyCls: ''
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var o = options,
					el = $( this ),
					items = el.find( o.items ),
                    main = {
						stm: null,
						clearTm: function(){
							var _t = this;
							if( _t.stm != null )
								clearTimeout( _t.stm );
						},
						detectEl: function( ID ){ return ID.length > 0 ? true : false; },
						isVisible: function(){
							var _t = this, b = false;
							if( o.isVisible !== '' ){
								var e = $( o.isVisible );
								if( _t.detectEl( e ) )
									if( e.is(':visible') )
										b = true;	
							}
							return b;
						},
						overlayControls: function( k ){
							var _t = this;
							if( o.overlay ){
								if( k == 'opened' ) bdy.addClass( o.bdyCls );
								else{ 
									var e = el.find( o.items + '.' + o.customClass );
									if( !_t.detectEl( e ) ) 
										bdy.removeClass( o.bdyCls );
								}
							}
						},
						setPos: function( ID ){
							if( o.setPos ){
								var _t = this, k = $(o.controls, ID);
								if( _t.detectEl( k ) ){
									var e = $('.site-header-inner-top');
									if( uty.detectEl( e ) ){
										/* bu kısım site bazlı değişebilir */
										var x1 = ID.offset().left + 810, x2 = e.width() + e.offset().left;
										if( x1 >= x2 ) k.css({ 'left': x2 - x1 });
									}
								}
							}
						},
						closeElem: function(){
							if( o.closeElem != '' )
								$( o.closeElem ).each(function(){
									var ths = $( this ).get( 0 );
									if( typeof ths.closed !== 'undefined' )	
										ths.closed();
								});
						},
						events: {
							onMouseEnter: function(){
								var _t = main, ths = $( this );
								
								if( _t.isVisible() ) return false;
								
								if( _t.detectEl( $(o.controls, ths) ) ){
									_t.clearTm();
									_t.stm = setTimeout(function(){
										_t.closeElem();
										ths.addClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.setPos( ths );
										_t.overlayControls('opened');
									}, o.openedDelay);
								}
							},
							onMouseLeave: function(){
								var _t = main, ths = $( this );
									if( _t.isVisible() ) return false;
									_t.clearTm();
									_t.stm = setTimeout(function(){
										ths.add( ths.siblings( o.siblings ) ).removeClass( o.customClass );
										_t.overlayControls('closed');
									}, o.closedDelay);
							},
							onClick: function( e ){
								var _t = main, ths = $( this ).parent( o.siblings );
								if( _t.detectEl( $(o.controls, ths) ) && !_t.isVisible() ){
									e.preventDefault();
									if( ths.hasClass( o.customClass ) ){
										ths.removeClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.overlayControls('closed');
									}else{
										ths.addClass( o.customClass ).siblings( o.siblings ).removeClass( o.customClass );
										_t.setPos( ths );
										_t.overlayControls('opened');
									}
								}
							},
							bdyClicked: function( e ){
								var _t = main;
								if( !el.is( e.target ) && el.has( e.target ).length === 0 && !_t.isVisible() ){
									//$('.' + o.customClass, el).removeClass( o.customClass );
									el.find('> ul > li').removeClass( o.customClass );
									_t.overlayControls('closed');
								}
							}
						},
						addEvent: function(){
							var _t = this;
							
							if( o.eventType == 'hover' )
								items.bind('mouseenter', _t.events.onMouseEnter).bind('mouseleave', _t.events.onMouseLeave);
							else if( o.eventType == 'click' )
								$(o.clickedElem, items).bind('click', _t.events.onClick);		
							
							if( o.bdyClicked )
								$('body, html').bind('click touchstart', _t.events.bdyClicked);
						},
						destroy: function(){
							var _t = this;
							$('.' + o.customClass, el).removeClass( o.customClass );
							_t.overlayControls('closed');
						},
						init: function(){
							var _t = this;
								_t.addEvent();
						}
					};  
				
				
				this.closed = function() {
                    if( main.stm != null ) clearTimeout( main.stm );
                    main.destroy()
                };
				
				main.init();              
            })
        }
    })
})(jQuery, window);


(function($) {
    $.fn.extend({
        minusSimpleSticky: function(options, callback) {
            var defaults = {
				customClass: 'fixed-div', 
				begin: '',
				attachment: ''
            };
            var options = $.extend(defaults, options);
            return this.each(function() {
                var opt = options,
					ID = $( this ),
					begin = $( opt.begin ),
					attachment = $( opt.attachment ),
					win = $( window ),
                    main = {
						adjust: function(){
							var _t = this, wst = parseFloat( win.scrollTop() );
							
							if( !uty.visibleControl() ){
								if( wst >= begin.offset().top ){
									
									var top = 0,
										att = attachment.offset().top + attachment.outerHeight( true ),
										bgn = wst + ID.outerHeight( true );
								 
									if( bgn >= att )
										top = att - bgn;
									
									ID.css({ 'position': 'fixed', 'top': top, 'width': '100%', 'max-width': 331 });
								}else
									ID.css({ 'position': '', 'top': '', 'width': '', 'max-width': '' });		
							}else
								ID.css({ 'position': '', 'top': '', 'width': '', 'max-width': '' });
						},
						addEvent: function(){
							var _t = this;	
							win.bind('resizestop', _t.adjust);
							win.resize( _t.adjust );
							win.scroll( _t.adjust ).scroll();
						},
						init: function(){
							var _t = this;
							if( uty.detectEl( begin ) )
								_t.addEvent();
						}
					};  
								
				main.init();              
            })
        }
    })
})(jQuery, window);



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var bdy = $('body'),
	win = $( window ),
	doc = $( document ),
	wt = parseFloat( win.width() ),
	ht = parseFloat( win.height() ),
	wst = parseFloat( win.scrollTop() ),
	sRatio,
	isMobile = mobile.detect(),
	editableMode = $('.admin-wrapper').length > 0 || $('[editable]').length > 0 ? true : false,
	uty = {
		speed: 666,
		easing: 'easeInOutExpo',
		ani: function( o, callback ){
			var _t = this, ID = o['el'];
			if( _t.detectEl( ID ) ){
				ID.stop().animate(o['prop'], o['speed'] || _t.speed, o['easing'] || _t.easing);
				setTimeout(function(){
					if( typeof callback !== 'undefined' )
						callback();
				}, ( o['speed'] || _t.speed ) + 1);
			}
		},
		setAttr: function( o ){
			o['el'].attr( o['prop'], o['val'] || '' );
		},
		setCls: function( o ){
		var _t = this, ID = $( o['ID'] || '' ), typ = o['typ'] || '', cls = o['cls'] || '';
			if( _t.detectEl( ID ) ){
				if( typ == 'add' ) ID.addClass( cls );
				else ID.removeClass( cls ); 
			}	
		},
		detectEl: function( ID ){
			return ID.length > 0 ? true : false;
		},
		ajx: function( o, callback ){
			$.ajax({
				type: o['type'] || 'GET',
				dataType: o['dataType'] || 'html',
				url: o['uri'] || '',
				data : o['param'] || {},
				contentType: o['contentType'] || '',
				error: function( e ){ 
					if( typeof callback !== 'undefined' ) 
						callback({ type: 'error' }); 
				},
				timeout: 30000,
				success:function( d ){ 
					if( typeof callback !== 'undefined' ) 
						callback({ type: 'success', val: d });
				}
			});
		},
		getScript: function( o, callback ){
			$.getScript(o['uri'], function(){
				if( typeof callback !== 'undefined' ) 
					callback();
			});
		},
		cssClass: function( o, callback ){
			var _t = this, ID = $( o['ID'] ), k = o['delay'], type = o['type'], cls;
			if( _t.detectEl( ID ) ){
				if( type == 'add' ){
					cls = o['cls'] || ['ready', 'animate'];
					ID.addClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().addClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
				}else{
					cls = o['cls'] || ['animate', 'ready'];
					ID.removeClass( cls[ 0 ] ).delay( k ).queue('fx', function(){ $( this ).dequeue().removeClass( cls[ 1 ] ); if( typeof callback !== 'undefined' ) callback(); });
				}
			}
		},
		pageScroll: function( o, callback ){
			var _t = this;
			$('html, body').stop().animate({ scrollTop: o['scrollTop'] || 0 }, o['speed'] || _t.speed, o['easing'] || 'easeInOutExpo', function(){ 
				if( typeof callback !== 'undefined' )
					callback();  
			});
		},
		lettering: function( o, callback ){
			var _t = this, ID = $( o['ID'] );
			if( _t.detectEl( ID ) )
				ID.lettering( o['type'] );
		},
		slider: function( o, callback ){
			var _t = this;
			if( _t.detectEl( $( o['ID'] ) ) ){ 
				var ID = $( o['ID'] );
					ID = ID.bxSlider( o['prop'] || {} );
				return ID;	
			}
		},
		lazyLoad: function( o, callback ){
			var _t = this, ID = $( o['ID'] );
			if( _t.detectEl( $('.lazy', ID) ) )
				$('.lazy', ID).lazyload({ effect: 'fadeIn', container: o['container'] || window, load: function(){ 
					$( this )
					.removeClass('lazy')
					.addClass('loaded'); 
				}});
		},
		unVeil: function( ID ){
			var _t = this;
			if( _t.detectEl( $('img.lazyload', ID) ) )
				$('img.lazyload', ID).unveil().trigger('unveil');
		},
		imageLoaded: function( o, callback ){
			var _t = this, el = o['el'];
			if( _t.detectEl( el ) ){
				var total = $('img', el).length, counter = 0;
	
				el
				.imagesLoaded()
				.always( function( instance ) {
					if( typeof callback !== 'undefined' )
						callback({ type: 'always' }); 
				})
				.done( function( instance ){
					if( typeof callback !== 'undefined' )
						callback({ elem: el, type: 'done', val: 1 });  
				})
				.fail( function(){
					if( typeof callback !== 'undefined' )
						callback({ type: 'fail' }); 
				})
				.progress( function( instance, image ) {
					var val = counter / total;
					if( typeof callback !== 'undefined' )
						callback({ type: 'progress', val: counter / total }); 
					counter++;
				});
			}
		},
		wayPoint: {
			el: 'article',
			active: true,
			rate: 1,
			threshold: 80,
			cls: 'animated',
			enabled: function(){ this.active = true; },
			disabled: function(){ this.active = false; },
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) && _t.active )
					el.each(function(){
                        var ths = $( this ),
							o1 = { x: 0, y: wst, width: wt, height: ht * _t.rate },
               				o2 = { x: 0, y: ths.offset().top + _t.threshold, width: wt, height: ths.height() * _t.rate };
						
						if( o1.x < o2.x + o2.width && o1.x + o1.width  > o2.x && o1.y < o2.y + o2.height && o1.y + o1.height > o2.y )
							ths.addClass( _t.cls );	
                    });
			}
		},
		compactMenu: {
			rate: 0,
			cls: 'compact-menu',
			init: function(){
				var _t = this;
				if( wst > _t.rate && !bdy.hasClass( _t.cls ) )
					bdy.addClass( _t.cls );
				else if( wst == _t.rate && bdy.hasClass( _t.cls ) )
					bdy.removeClass( _t.cls );
			}
		},
		hoverVideo: {
			el: '.ems-categories li',
			cls: 'active',
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el.hover(function(){
						var ths = $( this );
						ths.addClass( _t.cls ).find('video').get( 0 ).play();
					}, function(){
						var ths = $( this );
						ths.removeClass( _t.cls ).find('video').get( 0 ).pause();
					});	
			}
		},
		clearScriptTag: function( k ){
			var SCRIPT_REGEX = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
			while( SCRIPT_REGEX.test( k ) )
				k = k.replace(SCRIPT_REGEX, '');	
			return k;
		},
		trimText: function( k ){
			return k.replace(/(^\s+|\s+$)/g,'');
		},
		cleanText: function( k ){
			return k.replace(/\s+/g, '');
		},
		diff: function( arr1, arr2 ){
			var newArr = [];
			var arr = arr1.concat(arr2);
		
			for (var i in arr) {
				var f = arr[i];
				var t = 0;
				for (j = 0; j < arr.length; j++) {
					if (arr[j] === f) {
						t++;
					}
				}
				if (t === 1)
					newArr.push(f);
				
			}
			return newArr;
		},
		getCat: function(){
			return minusLoc.get('?', 'kat', urlString) || '';
		},
		isVisible: '.visibility-control',
		visibleControl: function(){
			var _t = this, b = false;
			if( _t.isVisible !== '' ){
				var e = $( _t.isVisible );
				if( uty.detectEl( e ) )
					if( e.is(':visible') )
						b = true;	
			}
			return b;
		},
		Cookies: function( o ){ 
			var typ = o['typ'] || '', name = o['name'] || '';
			if( typ == 'set' ){ 
				var date = new Date(), minutes = o['minutes'] || 5;
					date.setTime( date.getTime() + ( minutes * 60 * 1000 ) );
				$.cookie(name, o['value'] || '', { expires: date, path: '/' });
			}else if( typ == 'get' )
				return $.cookie( name );
		},
		priceFormat: function(ths, n, x) {
			var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
			return ths.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$&.');
		},
		getPrc: function( ID ){
			var _t = this, k = ID.eq( 0 ).text();
			return parseFloat( k.replace(/\./, '').replace(/\,/, '.') ) 
		}
	},
	management = {
		clss: {
			arr: [
				//{ main: '.contact-switch__content-container div:first-child', target: '.contact-switch__content-container div:first-child', type: 'add', cls: 'active' },
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), type = o['type'] || 'add', cls = o['cls'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){
					if( type == 'add' )
						target.addClass( cls );
					else
						target.removeClass( cls );
				}
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );	
				
			}
		},
		append: {
			arr: [
				{ 'main': '[id$="lblNavigation"] a:last', 'target': '.ems-prd-cat-name', 'add': 'append', 'clone': true },
				{ 'main': '.prd-awards', 'target': '.ems-prd-zoom .thumb-pager', 'add': 'append' },
				{ 'main': '.ems-page-product-detail .paroKampanyaAd', 'target': '.plhParoAciklama-clone', 'add': 'append', 'clone': true },
				{ 'main': '.ems-page-product-detail .popupTaksit', 'target': '.mod-payment-options', 'add': 'append' },
				{ 'main': '.ems-page-product-detail .yorumListe_main', 'target': '.mod-comments', 'add': 'append' },
				{ 'main': '.clone-bottom-btns .next > a', 'target': '.ems-col-right .bottom-step .next', 'add': 'append' },
				{ 'main': '.clone-bottom-btns .prev > a', 'target': '.ems-col-right .bottom-step .prev', 'add': 'append' },
				{ 'main': '.header-top-menu', 'target': '.header-menu', 'add': 'append', 'clone': true, 'cls': 'obj-mobile' },
				{ 'main': '.cart-section-right', 'target': '.cart-section-right-append', 'add': 'append' },
				{ 'main': '.ems-page-cart.step0 .bottom-step', 'target': '.bottom-step-append', 'add': 'append', 'clone': true },
				{ 'main': '.ems-page-cart.step1 .bottom-step:not(".obj-step0")', 'target': '.bottom-step-append', 'add': 'append', 'clone': true },
				{ 'main': '[id$="ascPagingDataUst_lblKayit"]', 'target': '.content-count .qty', 'add': 'html' },
				{ 'main': '.ems-page-campaigns .ems-form.campaign-search', 'target': '.ems-page-campaigns .row-2 .css-editable.page-top-desc', 'add': 'after' },
				{ 'main': '.social-login-wrapper', 'target': '.social-login-wrapper-append', 'add': 'append', 'clone': true },
				//{ 'main': '.ems-page-services-form .xmlForm_btnGonder', 'target': '.step.step-7 .step-footer', 'add': 'append' },		
				{ 'main': '.ems-prd-list-sort-btn', 'target': '.ems-prd-list-count', 'add': 'after' },
				{ 'main': '[id$="txtUYE_CEPTELEFONALAN"]', 'target': '[id$="txtUYE_CEPTELEFONALAN"]', 'template': '<span class="ems-field cep-tel-alan"></span>', 'add': 'wrap' },
				{ 'main': '[id$="txtUYE_CEPTELEFON"]', 'target': '[id$="txtUYE_CEPTELEFON"]', 'template': '<span class="ems-field cep-tel"></span>', 'add': 'wrap' },
				{ 'main': '.urunKiyaslamaOzellik_tumunuTemizle', 'target': '.pnlUrunKiyasSecim', 'add': 'append' },
				{ 'main': '.lbfFilterApply .filter-apply-btn', 'target': '.filter-popup', 'add': 'append', 'clone': true }

				
			],
			set: function( o ){
				var main = $( o['main'] || '' ), target = $( o['target'] || '' ), clone = o['clone'] || '', type = o['add'] || '', cls = o['cls'] || '';
				if( uty.detectEl( main ) && uty.detectEl( target ) ){
					var e = clone != '' ? main.clone() : main;
						e = e.eq( 0 );
					if( cls != '' )
						e.addClass( cls );
							
					if( type == 'prepend' ) target.prepend( e );
					else if( type == 'before' ) target.before( e );
					else if( type == 'after' ) target.after( e );
					else if( type == 'html' ) target.html( e.html() );
					else if( type == 'wrap' ) target.wrapAll( o['template'] || '' );
					else target.append( e );
				}
			},	
			init: function( k ){
				var _t = this, arr = k || _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );	
			}
		},
		template: {
			arr: [
				{ 'template': '<div class="visibility-control"></div>', 'target': 'body', 'add': 'append', 'controlCls': '.visibility-control' }	
			],
			set: function( o ){
				var target = $( o['target'] || '' ), type = o['add'] || '', controlCls = o['controlCls'] || '';
				if( uty.detectEl( target ) && !uty.detectEl( target.find( controlCls ) ) ){
					var e = o['template'] || '';
					if( type == 'prepend' ) target.prepend( e );
					else if( type == 'before' ) target.before( e );
					else if( type == 'after' ) target.after( e );
					else if( type == 'html' ) target.html( e );
					else target.append( e );
				}
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			},
		},
		setAttr: {
			arr: [
				//{ main: 'a.btnOdemeBilgiDon', attr: 'href', value: 'javaScript:window.print();' },
			],
			set: function( o ){
				var _t = this, main = $( o['main'] || '' );;
					if( uty.detectEl( main ) )
						main.attr( o['attr'], o['value'] );
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		pageScroll: {
			arr: [
				{ 'main': "a.go-all-features", 'target': ".all-features" },
				{ 'main': "a.scroll-down", 'target': "a.scroll-down" }	
			],
			set: function( o ){
				var _t = this, main = $( o['main'] || '' ), target = $( o['target'] || '' );
					if( uty.detectEl( main ) && uty.detectEl( target ) )
						main
						.attr('data-target', o['target'] )
						.unbind('click')
						.bind('click', function(){
							var ths = $( this ), target = $( ths.attr('data-target') || '' );
							if( uty.detectEl( target ) )
								uty.pageScroll({ scrollTop: target.offset().top })
						});
			},	
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		init: function(){
			var _t = this;
				_t.clss.init();
				_t.append.init();
				_t.template.init();
				_t.setAttr.init();
				_t.pageScroll.init();
		}
	},
	plugin = {
		cls: { active: 'plugins-active' },
		sticky: {
			arr: [				
				{ 'ID': '.cart-section-right', 'prop': { begin: '.cart-section-right-append', attachment: '.row-holder-1.ems-container' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ), prop = o['prop'] || {}; 
				if( uty.detectEl( ID ) ){
					ID.each(function(){
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] )  ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusSimpleSticky( prop );
						}
					})
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		selectBox: {
			arr: [				
				//{ 'ID': '.member-menu', 'prop': { 'inside': '> ul > li > a', 'customClass': 'member-menu-selecbox' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ), prop = o['prop'] || {}; 
				if( uty.detectEl( ID ) ){
					ID.each(function(){
						var ths = $( this );
						if( !ths.hasClass( plugin['cls']['active'] )  ){
							ths.addClass( plugin['cls']['active'] );
							ths.minusSelectBox( prop );
						}
					})
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		DropDown: {
			cls: { active: 'plugins-dropdown-active' },
			arr: [
				{ 'ID': '.dropdown' },
				{ 'ID': '.member-menu', 'prop': { 'prts': '.member-menu' } },
				//{ 'ID': '.step-form-wrapper .categories', 'prop': { 'prts': '.categories' } }
			],			
			set: function( o ){
				var _t = this, ID = $( o['ID'] || '' );
				if( uty.detectEl( ID ) )
					ID.each(function(){ 
						var ths = $( this );
						if( !ths.hasClass( _t['cls']['active'] ) ){
							ths.addClass( _t['cls']['active'] );
							ths.minusCustomDropDown( o['prop'] || {} ); 
						}
					});
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}
		},
		memberMenu: {
			el: '.member-menu a',
			cls: { selected: 'selected' },
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					var loc = window.location, pathname = loc.pathname, locH = loc.href, srch = loc.search, uri = urlString.replace(loc.origin, '');
					el
					.each(function(){ 
						var ths = $( this ), hrf = ths.attr('href') || '';
						if( hrf == pathname || hrf == locH || hrf == ( pathname + srch ) || hrf == uri )
							ths.parent('li').addClass( _t.cls['selected'] ).parents('li').eq( 0 ).addClass( _t.cls['selected'] );
						
					});
				}
			}
		},
		menu: {
			cls: { active: 'plugin-menu-active' },
			arr: [
				{ 'ID': '.header-menu', 'unbind': '.lvl2 > li', 'selectionFirst': '.lvl2', 'prop': { 'items': 'ul > li', 'isVisible': '.visibility-control', 'overlay': true, 'bdyCls': 'main-menu-opened', 'bdyClicked': true, 'eventType': isMobile ? 'click' : 'hover', 'controls': '> ul li, > div li' /*controls: '> ul li:not(.cat-link), > div li:not(.cat-link)'*/ } },
				{ 'ID': '.section-all-cat', 'prop': { 'eventType': 'click' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] ), b = o['unbind'] || '', s = o['selectionFirst'] || ''; 
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( _t['cls']['active'] ) ){
						ID.addClass( _t['cls']['active'] );
						ID.minusMenu( o['prop'] || {} ); 
						
						if( b != '' ) 
							$(b, ID)	.unbind('mouseleave')
						
						if( s != '' )	
							$(s, ID).each(function(){ $( this ).find('> li:eq( 0 )').addClass('selected'); });
					}
				}
			},
			init: function(){
				var _t = this;
				for( var i = 0; i < _t.arr.length; ++i )
					_t.set( _t.arr[ i ] );
			}
		},
		tabMenu: {
			cls: { active: 'plugin-tab-menu-active' },
			arr: [
				{ 'ID': '.ems-tab-horizontal-content, .ems-tab-vertical' },
				{ 'ID': '.ems-tab-mobi-acc' }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] || '' ), prop = o['prop'] || {};
				if( uty.detectEl( ID ) )
					ID.each(function(){ 
						var ths = $( this );
						if( !ths.hasClass( _t['cls']['active'] ) ){
							ths.addClass( _t['cls']['active'] );
							ths.minusTabMenu( prop ); 
						}
					});
				
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}
		},
		slider: {
			cls: { active: 'plugin-swiper-active' },
			el: '.swiper-container, .easy-selection .swiper-content',
			target: '.swiper-wrapper > li',
			adjust: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el.each(function(){ 
						var ths = $( this );
						if( uty.detectEl( ths.find( _t.target ) ) ){
							ths = ths.get( 0 ); 	
							if( typeof ths.adjust !== 'undefined' )
								ths.adjust();
						}
					});
			},
			set: function( ID ){
				var _t = this;
				if( !ID.hasClass( _t['cls']['active'] ) && uty.detectEl( ID.find( _t.target ) ) ){
					ID.addClass( _t['cls']['active'] ); 
					ID.minusSliderSwiper(); 
				}
				
				
				/*if( !ID.hasClass( _t['cls']['active'] ) ){
					ID.addClass( _t['cls']['active'] );
					ID.minusSlider(); 
				}*/
				
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					el.each(function(){ 
						var ths = $( this );
						_t.set( ths );
					});
				}
			}
		},
		isotop: {
			cls: { active: 'plugin-masonry-active', loaded: 'masonry-loaded' },
			arr: [
				{ 'ID': '.section-cat-sub-list .section-inner > ul', 'prop': { itemSelector: 'li', 'layoutMode': 'masonry' } },
				{ 'ID': '.footer-menu-top', 'prop': { itemSelector: 'ul', 'layoutMode': 'masonry' } }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] || '' );
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( _t['cls']['active'] ) ){
						ID.addClass( _t['cls']['active'] );
						uty.imageLoaded({ el: ID }, function( d ){
							if( d['type'] == 'done' ){
								var e = d['elem']; 
									e.isotope( o['prop'] || {} );					
									e.addClass( _t['cls']['loaded'] );
							}
						});
					}
				}
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		prdListSort: {
			el: '.ems-prd-list-sort li',
			mobiBtn: '.ems-prd-list-sort-btn .btn-sort',
			mobiCloseBtn: '.ems-prd-list-sort .btn-close',
			cls: { selected: 'selected', ready: 'sort-popup-ready', animate: 'sort-popup-animate' },
			param: 'srt',
			popup: function( k ){
				var _t = this;
				if( k == 'opened' )
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				else
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
			},
			control: function(){
				var _t = this, k = minusLoc.get('?', _t.param) || '';
				$( _t.el + '[rel="'+ k +'"]' ).addClass( _t.cls['selected'] );
			},
			addEvent: function(){
				var _t = this, el = $( _t.el ), mobiBtn = $( _t.mobiBtn ), mobiCloseBtn = $( _t.mobiCloseBtn );
				el.unbind('click').bind('click', function(){
					var ths = $( this ), rel = ths.attr('rel') || '', uri = '';
					if( rel != '' ){
						var loc = window.location.search;
						if( loc.indexOf( _t.param + '=' + rel ) != -1 )
							uri = minusLoc.remove('?', _t.param);	
						else
							uri = minusLoc.put('?', rel, _t.param);
							
						if( uri != '' )
							modules.filter.ajx({ uri: uri, target: modules.filter['target']['list'], historyPush: true });
						
						_t.popup('closed');		
					}
				});	
				if( uty.detectEl( mobiBtn ) )
					mobiBtn.unbind('click').bind('click', function( e ){
						e.preventDefault();
						if( bdy.hasClass(  _t['cls']['ready'] ) )
							_t.popup('closed');
						else
							_t.popup('opened');
					});
				if( uty.detectEl( mobiCloseBtn ) )
					mobiCloseBtn.unbind('click').bind('click', function( e ){
						e.preventDefault();
						_t.popup('closed');
					});
					
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					_t.control();
					_t.addEvent();
				}	
			}
		},
		faqAcc: {
			cls: { selected: 'selected' },
			el: '.faq-item',
			btn: '.faq-item .question',
			addEvent: function(){
				var _t = this, el = $( _t.el ), btn = $( _t.btn );
				btn
				.bind('click', function(){
					var ths = $( this), prt = ths.parents( _t.el ).eq( 0 );
					if( prt.hasClass( _t.cls['selected'] ) )
						el.removeClass( _t.cls['selected'] );
					else{
						el.removeClass( _t.cls['selected'] );
						prt.addClass( _t.cls['selected'] );
					}
				});
				
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el ) ) )
					_t.addEvent();
			}
		},
		tooltip:{
			cls: { active: 'plugin-tooltip-active', selected: 'selected', left: 'left-item', right: 'right-item', middle: 'middle-item' },
			arr: [
				{ 'ID': '.feature-info', 'target': '.desc-wrapper' }
			],
			set: function( o ){
				var _t = this, ID = $( o['ID'] || '' ), trg = o['target'] || '';
				if( uty.detectEl( ID ) ){
					if( !ID.hasClass( _t['cls']['active'] ) ){
						var evt = isMobile ? 'click' : 'mouseenter';
						ID
						.addClass( _t['cls']['active'] )
						.bind(evt, function(){
							var ths = $( this ), k = ths.offset().left + ths.find( trg ).width();
								ths.addClass( _t.cls['selected'] );
							if( k >= wt )
								ths.addClass( _t.cls['right'] ).removeClass( _t.cls['left'] ).removeClass( _t.cls['middle'] );		
						})
						.bind('mouseleave', function(){
							var ths = $( this );
								ths.removeClass( _t.cls['selected'] ).removeClass( _t.cls['right'] ).removeClass( _t.cls['left'] ).removeClass( _t.cls['middle'] );	
						});
					}
				}
			},
			init: function(){
				var _t = this, arr = _t.arr;
				for( var i = 0; i < arr.length; ++i )
					_t.set( arr[ i ] );
			}	
		},
		audioBtn: {
			cls: { active: 'is-play' },
			el: { wrp: '.ad-music', btn: '.btn-video-play, .btn-listen' },
			control: function( o ){
				var _t = this, ID = o['ID'].find('audio'), typ = o['typ'] || '';
				if( uty.detectEl( ID ) ){
					ID = ID.get( 0 );
					if( typ == 'play' ) ID.play();
					else ID.pause();	
				}
			},
			addEvent: function(){
				var _t = this, wrp = $( _t.el.wrp );
				
				wrp
				.find( _t.el.btn )
				.removeAttr('onclick')
				.bind('click', function(){
				 	var ths = $( this ), prt = ths.parents( _t.el.wrp );
					if( prt.hasClass( _t.cls['active'] ) ){
						_t.control({ ID: $( _t.el.wrp + '.' + _t.cls['active'] ), typ: 'pause' })
						wrp.removeClass( _t.cls['active'] );
					}else{
						_t.control({ ID: $( _t.el.wrp + '.' + _t.cls['active'] ), typ: 'pause' })
						wrp.removeClass( _t.cls['active'] );
						prt.addClass( _t.cls['active'] );
						_t.control({ ID: prt, typ: 'play' })
					}
						
				})
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el.wrp ) ) )
					_t.addEvent();
			}
		},
		ytBtn: {
			btn: '.ad-video .btn-video-play, .ems-page-product-videos .btn-video-play, .ems-page-inspiration-detail .btn-video-play, .thumb-gallery .thumb-wrp [data-video], .prd-detail-top-slider .btn-video-play',
			template: {
				ytLnk: '//www.youtube.com/embed/{{id}}?rel=0&autoplay={{autoplay}}'
			},
			addEvent: function( k ){
				var _t = this, btn = $( _t.btn );
				btn
				.unbind('click')
				.bind('click', function(){
					var ths = $( this ), rel = ths.attr('data-video');
					if( rel != '' )
						bdy.minusPopup({ type: 'iframe', content: _t.template.ytLnk.replace(/{{id}}/g, rel).replace(/{{autoplay}}/g, isMobile ? 0 : 1), openWith: 'auto', width: 720, height: 480, customClass:'video-detail-popup', closeWith:'#minHider, .minPpWrp' });
				});
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.btn ) ) )
					_t.addEvent();
			}
		},
		init: function(){
			var _t = this;
				_t.sticky.init();
				_t.selectBox.init();
				_t.faqAcc.init();
				_t.memberMenu.init();
				_t.DropDown.init();
				_t.isotop.init();
				_t.slider.init();
				_t.prdListSort.init();
				_t.tabMenu.init();
				_t.menu.init();
				_t.tooltip.init();
				_t.ytBtn.init();
				_t.audioBtn.init();
		}
	},
	api = {
		youtube: {
			el: '.btn-video-play',
			cls: 'yt-api-active',
			set: function(){
				var _t = this;
				if( !uty.detectEl( $('script[src*="//www.youtube.com/iframe_api"]') ) ) 
		 			uty.getScript({ uri: '//www.youtube.com/iframe_api' }, function(){ bdy.addClass( _t.cls ); });
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					_t.set();
			}	
		},
		maps: {
			el: '.footer-map',
			stm: null,
			delay: 500,
			clearTimeOut: function(){
				var _t = this;
				if( _t.stm !== null ) 
					clearTimeout( _t.stm );
			},
			timeOut: function(){
				var _t = this, el = $( _t.el );
					_t.clearTimeOut();
					_t.stm = setTimeout(function(){
						el.unbind('mouseenter mouseleave');
						if( !uty.detectEl( $('script[src*="//maps.googleapis.com/maps/api"]') ) ) 
							uty.getScript({ uri: '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=AIzaSyBWA5W9FLE1IwQAPCCdfVLx2Qk8oGdPqjA' }, function(){ 
								el.minusMap();
							});
						else
							el.minusMap();	
							
					}, _t.delay);
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) )
					el
					.bind('mouseenter', function(){ _t.timeOut(); })
					.bind('mouseleave', function(){ _t.clearTimeOut(); });
					
				
				if( uty.detectEl( $('.service-list-holder') ) )
					if( !uty.detectEl( $('script[src*="//maps.googleapis.com/maps/api"]') ) ) 
						uty.getScript({ uri: '//maps.googleapis.com/maps/api/js?v=3.exp&sensor=false&libraries=places&key=AIzaSyBWA5W9FLE1IwQAPCCdfVLx2Qk8oGdPqjA' }, function(){ 
							$('.service-list-holder').minusMap({ sysDrpClicked: true, gaSend: true });
						});	
			}
		},
		init: function(){
			var _t = this;
				_t.youtube.init();
				_t.maps.init();
		}
	},
	modules = {
			 social: {
			  appID: appId,
			  url: '//www.arcelik.com.tr/',
			  redirect_uri: '//www.arcelik.com.tr?redirect_uri=fcbk',
			  loc: window.location.hostname,
			  template:{
				//'facebookMobi': '//m.facebook.com/dialog/feed?app_id={{appID}}&link={{url}}&picture={{media}}&name={{name}}&caption={{caption}}&description={{description}}&redirect_uri={{url}}&href={{source}}&display=popup',
				//'facebook': '//www.facebook.com/dialog/feed?app_id={{appID}}&link={{url}}&picture={{media}}&name={{name}}&caption={{caption}}&description={{description}}&redirect_uri={{url}}&href={{source}}&display=popup',
				//'facebookVideo': '//www.facebook.com/dialog/share?app_id={{appID}}&redirect_uri={{url}}&href={{source}}&display=popup',
				'twitter': '//twitter.com/share?&url={{url}}&via={{name}}&text={{url}} {{description}}',
				'pinterest': '//pinterest.com/pin/create/button/?description={{description}}&url={{url}}&media={{media}}',
				'googlePlus': '//plus.google.com/share?url={{url}}',
				'whatsapp': 'whatsapp://send?text={{url}}',
				'facebook': '//www.facebook.com/sharer/sharer.php?u={{url}}',
				'facebookMobi': '//www.facebook.com/sharer/sharer.php?u={{url}}'
			  },
			  openWinPp: function( k ){
				var nw = window.open(k, $('title').text() || '', 'height=300,width=550');
				if( window.focus ) nw.focus();
				return false;
			  },
			  share: function( k ){
				  var _t = this, el = $( k ), typ = el.attr('data-type') || '', ttl = el.attr('data-ttl') || '', dsc = el.attr('data-dsc') || '', media = el.attr('data-img') || '', url = el.attr('data-uri') || '', lnk = _t.template[ typ ];
				  
				  if( isMobile && typ == 'facebook' )
				  	lnk = _t.template['facebookMobi'];
				  
				  if( url.indexOf( _t.loc ) == -1 )
				  	url =  _t.loc + url;
				 
				  lnk = lnk.replace(/{{appID}}/g, _t.appID).replace(/{{url}}/g, url).replace(/{{source}}/g, url).replace(/{{media}}/g, media).replace(/{{name}}/g, ttl).replace(/{{caption}}/g, ttl).replace(/{{description}}/g, dsc).replace(/{{redirect_uri}}/g, _t.redirect_uri);
				  
				  _t.openWinPp( lnk );
			  }
			},
			crediCart: {
				wrp: '.ems-cart-pay-type',
				drp1: '[id$="drpKSA_SPR_ID"]',
				drp2: '[id$="drpKSY_SPR_ID"]',
				name: '[id$="txtKKARTISIM"]',
				cvc: '[id$="txtKKARTCVCNO"]',
				cvcTarget: '#back .cvc',
				numKeyPad: '.cc-numkeypad',
				cardType: '#cardType img',
				el: '#creditCardExample',
				m: '.cardDate .month',
				y: '.cardDate .year',
				cn: '.cardName',
				tmp: '<div id="creditCardExample" class="showFront"> <div id="front"> <span class="cardBank"> <img> </span> <span class="cardNo"> <em class="cardNo1">1234</em> <em class="cardNo2">5678</em> <em class="cardNo3">9101</em> <em class="cardNo4">1234</em> </span> <span class="cardDate"> <em class="month"> AA </em> / <em class="year"> YY </em> </span> <span class="cardName"></span> <span class="cvc"></span> <span id="cardType"><img border=""/></span> </div><div id="back"> <span class="cvc"></span> </div></div>',
				add: function(){
					var _t = this;
					$( _t.wrp ).prepend( _t.tmp );
				},
				setCardNum: function( typ ){
					var _t = this, k = _t.txtTrim( $( _t.numKeyPad ).val() ), c = _t.txtCleanText( $( _t.numKeyPad ).val() );
					
					if( typ == 'amex' || typ == null )
						$( 'span.cardNo em' ).html('');	
					
					$( 'span.cardNo em.full' ).html('');
					if( c.length > 0 ){
						k = k.split(' ');
						for( var i = 0; i < k.length; ++i ){
							var n = _t.txtCleanText( k[ i ] );
							if( n != '' )
								$( 'span.cardNo em.cardNo' + ( i + 1 ) ).addClass('full').html( n );
						}
					}
				},
				addEvent: function(){
					var _t = this, ct = $( _t.cardType ), el = $( _t.el ), cn = $( _t.cn );
					$( _t.drp1 ).bind('change',function(){ $( _t.m ).html( $( this ).val() ); }).change();
					$( _t.drp2 ).bind('change',function(){ $( _t.y ).html( $( this ).val() ); }).change();
					$( _t.name ).bind('keyup', function(){ 
						var k = _t.txtTrim( $( this ).val() );
						cn.html( k );
						if( k != '' ) cn.addClass('full');
						else cn.removeClass('full');
					});
					$( _t.numKeyPad ).bind('keyup', function(){
						var typ = $.payment.cardType( _t.txtTrim( $( this ).val() ) );
						if( typ != null )
							ct.attr('src', '/scripts/keyboard/img/' + typ + '.png');
						else
							ct.removeAttr('src');
							
						setTimeout(function(){ _t.setCardNum( typ ); }, 10);
						
						
						var ths = $( this ), val = _t.txtCleanText( ths.val() );
						if( val.length < 6 ) _t.removeBankLogo();
							
					});
					$( _t.cvc )
					.bind('keyup', function(){ $( _t.cvcTarget ).html( $( this ).val() ) })
					.bind('focus', function(){ el.attr('class', 'showBack') })
					.bind('blur', function(){ el.attr('class', 'showFront') });
					
				},
				txtTrim: function( k ){
					return k.replace(/(^\s+|\s+$)/g,'');
				},
				txtCleanText: function( k ){
					return k.replace(/\s+/g, '');
				},
				bankLogoEl: '#front .cardBank',
				addBankLogo: function(){
					var _t = this, e = $( _t.bankLogoEl );
						e.addClass('show').html('');
					setTimeout(function(){ e.append( $('#imgBANKALOGO').clone() ); }, 10);
				},
				removeBankLogo: function(){
					var _t = this, el = $( _t.bankLogoEl );
					if( el.hasClass('show') )
						el.removeClass('show').html(''); 
				},
				init: function(){
					var _t = this, wrp = $( _t.wrp );
					if( wrp.length > 0 && $( _t.name ).length > 0 ){
						_t.add();		
						_t.addEvent();
					}
				}
				
			},
			prdCompact: {
				offset: -70,
				cls: { ready: 'fixed-compact-menu-ready' },
				wrp: '.ems-page-product-detail',
				target: '.ems-prd-description-full',
				template: '<div class="prd-compact animated slideInDown"><div class="prd-compact-inner"><div class="prd-compact-left"></div><div class="prd-compact-right"></div></div></div>',
				addEvent: function(){
					/* sepete ekle-eklendi sorunu çözümü için href, id manipüle etme */
					var e = $('.prd-compact .btnsepeteAt');
					if( uty.detectEl( e ) ){
						
						var k = e.attr('href') || '';
						e.attr('href', k.replace(/ctl00_u10/g, 'ctl00_u10_'));
						
						e = e.find('span');
						if( uty.detectEl( e ) ){
							k = e.attr('id') || '';
							e.attr('id', k.replace(/ctl00_u10/g, 'ctl00_u10_'));
						}
					}
				},
				add: function(){
					var _t = this, e = $( _t.wrp );
					if( uty.detectEl( e ) ){
						e.before( _t.template );
							management.append.init([
								{ main: '.ems-prd-detail-inner .inner-row-2 .ems-prd-name', target: '.prd-compact-left', add: 'append', clone: true },
								{ main: '.ems-prd-detail-inner .inner-row-2 .ems-prd-cat-name', target: '.prd-compact-left', add: 'append', clone: true },
								{ main: '.ems-prd-detail-inner .inner-row-2 .ems-prd-price', target: '.prd-compact-right', add: 'append', clone: true },
								{ main: '.ems-prd-detail-inner .inner-row-2 .ems-prd-add-to-cart', target: '.prd-compact-right', add: 'append', clone: true }
							]);
					}
				},
				adjust: function(){
					var _t = this, target = $( _t.target );
					if( uty.detectEl( target ) && uty.detectEl( $( _t.wrp ) ) ){
						var m = target.offset().top;
						if( wst + _t.offset >= m )
							bdy.addClass( _t.cls['ready'] );
						else
							bdy.removeClass( _t.cls['ready'] );	
					}
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.wrp ) ) ){
						_t.add();
						_t.addEvent();
					}
				}
			},
			mobiMenu: {
				wrp: '.nav-main',
				btn: '.obj-mobile.btn-menu',
				closeBtn: '.obj-mobile.btn-close',
				backBtn: '.nav-main .catBack',
				cls: { ready: 'mobi-menu-ready', animate: 'mobi-menu-animate', selected: 'selected', opened: 'opened', closed: 'mobi-menu-closed', lvl1: 'lvl1', lvl2: 'lvl2', subMenu: 'sub-menu' },
				animate: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 400, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });	
				},
				addEvent: function(){
					var _t = this, wrp = $( _t.wrp ), btn = $( _t.btn ), closeBtn = $( _t.closeBtn ), backBtn = $( _t.backBtn );
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							var ths = $( this );
							if( bdy.hasClass( _t.cls['ready'] ) )
								_t.animate('closed');
							else
								_t.animate('opened');	
						});
						
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ _t.animate('closed');	});	
					
					$('.header-menu ul > li > a')
					.each(function(){
						var ths = $( this ), sib = ths.siblings('div:not(".cat-obj-holder"), ul').find('li:not(".cat-link")'), prt = ths.parents('li').eq( 0 );  
						if( uty.detectEl( sib ) )
							prt.addClass( _t.cls['subMenu'] )
					})
					.bind('click', function( e ){
						var ths = $( this ), sib = ths.siblings('div, ul').find('li:not(".cat-link")'), prt = ths.parents('li').eq( 0 );
						if( uty.visibleControl() )
							if( uty.detectEl( sib ) ){
								e.preventDefault();
								
								if( prt.hasClass( _t.cls['selected'] ) )
									prt.add( prt.siblings('li') ).removeClass( _t.cls['selected'] );
								else	
									prt.addClass( _t.cls['selected'] ).siblings('li').removeClass( _t.cls['selected'] );
							}
					});
								
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] ).removeClass( _t.cls['animate'] );
					$('.header-menu ul > li').removeClass( _t.cls['selected'] );
					$( _t.wrp ).removeClass( _t.cls['lvl1'] ).removeClass( _t.cls['lvl2'] ); 
				},
				init: function(){
					var _t = this;
						_t.addEvent();
				}
			},
			cart: {
				amoundEl: 'span#lblUrunAdet',
				amountTarget: '.mCartBtn b, .cart-total-qty b',
				priceEl: 'span#lblUrunTutari',
				priceTarget: '.moduleMiniCart .price span',
				btn: '.moduleMiniCart .title a',
				closeBtn: '.vail.vailCart',
				cls: { ready: 'mini-cart-ready', animate: 'mini-cart-animate', empty: 'basket-empty', full: 'basket-full' },
				add: function(){
					var _t = this;
						_t.amound();
					uty.pageScroll({ scrollTop: 0 }, function(){ _t.opened(); });	
				},
				amound: function(){
					var _t = this, amoundEl = $( _t.amoundEl ), amountTarget = $( _t.amountTarget ), priceEl = $( _t.priceEl ), priceTarget = $( _t.priceTarget );
					if( uty.detectEl( amoundEl ) ){
						var val = parseFloat( uty.trimText( amoundEl.text() ) );
						if( isNaN( val ) ) val = 0; 
						
						if( val > 0 ) bdy.addClass( _t.cls['full'] ).removeClass( _t.cls['empty'] );
						else bdy.addClass( _t.cls['empty'] ).removeClass( _t.cls['full'] );
						
						if( uty.detectEl( amountTarget ) ) 
							amountTarget.text( val );
					}
					if( uty.detectEl( priceEl ) && uty.detectEl( priceTarget ) ){
						var val = parseFloat( priceEl.text() );
						priceTarget.text( uty.trimText( priceEl.text() ) );
					}
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] + ' ' + _t.cls['animate'] );
				},
				opened: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				},
				closed: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				init: function(){
					var _t = this, btn = $( _t.btn ), closeBtn = $( _t.closeBtn );
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							if( bdy.hasClass( _t.cls['ready'] ) ) 
								_t.closed();
							else
								_t.opened();
						});
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ 
							_t.closed();
						});
				},
			},
			login: {
				btn: '.mod-mini-login .btn-signin',
				closeBtn: '',
				showPassBtn: '.mod-mini-login .show-pass-btn',
				email: '.mod-mini-login input[id$="txtKUTU_UYEEMAIL"]',
				pass: '.mod-mini-login input[id$="txtUYE_SIFRE"]',
				err: '.errorKutuLogin',
				cls: { ready: 'mini-login-ready', animate: 'mini-login-animate', showPass: 'show' },
				check: function(){
					var _t = this, email = $( _t.email ), err = $( _t.err );
					if( uty.detectEl( err ) ){
						var ekt =  uty.cleanText( err.text() );
						if( ekt != '' ){
							_t.opened();
							uty.pageScroll();
							if( uty.detectEl( email ) ) email.focus();
						}
					}
				},
				destroy: function(){
					var _t = this;
					bdy.removeClass( _t.cls['ready'] + ' ' + _t.cls['animate'] );
				},
				opened: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
				},
				closed: function(){
					var _t = this;
					uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				set: function(){
					var e = $('.mod-mini-login [id$="lblUYE_ADSOYAD"]');
					if( uty.detectEl( e ) ){
						var k = e.text() || '';
						e.text( k );
						$('.member-menu-header .desc b').text( k );
					}					
				},
				init: function(){
					var _t = this, btn = $( _t.btn ), closeBtn = $( _t.closeBtn ), showPassBtn = $( _t.showPassBtn ), pass = $( _t.pass );
						_t.check();
					
					if( uty.detectEl( btn ) )
						btn.bind('click', function(){
							if( bdy.hasClass( _t.cls['ready'] ) ) _t.closed();
							else _t.opened();
						});
					
					if( uty.detectEl( closeBtn ) )
						closeBtn.bind('click', function(){ _t.closeBtn(); });
					
					if( uty.detectEl( showPassBtn ) && uty.detectEl( pass ) )
						showPassBtn.bind('click', function(){  
							var ths = $( this );
							if( ths.hasClass( _t.cls['showPass'] ) ){
								ths.removeClass( _t.cls['showPass'] );
								pass.prop('type', 'password');
							}else{
								ths.addClass( _t.cls['showPass'] );
								pass.prop('type', 'text');
							}
						});	
						
				}
			},
			filter: {
				closedObj: {	},
				wrp: '.ems-page-product-list',
				target: { list: '.ems-page-product-list', filter: '.ems-page-product-list' },
				btn: '.urunKiyaslamaOzellik_ozellik a, .menuKategori li:not(".main-cat") > a, .urunKiyaslamaOzellik_secimler > a, .urunKiyaslamaOzellik_tumunuTemizle > a, .urunPaging_pageNavigation a',
				toggleBtn: '.urunKiyaslamaOzellik_ozellikAd, .kutuKategori .kutuHeaderKategori',
				mobiBtn: '.ems-prd-list-sort-btn .btn-filter',
				mobiCloseBtn: '.filter-popup .btn-close, .filter-apply-btn',
				cls: { loading: 'filter-ajx-loading', filterSelected: 'filter-selected', closed: 'kapali', ready: 'filter-popup-ready', animate: 'filter-popup-animate', control: 'control-point' },
				popup: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });
				},
				loading: function( k ){
					var _t = this;
					if( k == 'add' ) bdy.addClass( _t['cls']['loading'] );
					else bdy.removeClass( _t['cls']['loading'] );
				},
				addEvent: function(){
					var _t = this, btn = $( _t.btn ), toggleBtn = $( _t.toggleBtn ), mobiBtn = $( _t.mobiBtn ), mobiCloseBtn = $( _t.mobiCloseBtn ), clicklable = true;
					
					if( uty.detectEl( btn ) )
						btn.bind('click', function( e ){
							if( history.pushState ){
								e.preventDefault();
								var ths = $( this ), uri = ths.attr('href') || '', targetEl = uty.detectEl( ths.parents('.menuKategori') ) ? 'list' : 'filter', e = $('.row-holder-1.ems-container');
								if( uri != '' ){
									if( uty.detectEl( e ) && ( !uty.visibleControl() || ths.hasClass('paging') ) )
										uty.pageScroll({ scrollTop: e.offset().top - 100 });
									_t.ajx({ uri: uri, target: _t['target'][ targetEl ], historyPush: true });
								}
							}
						});
					
					if( uty.detectEl( toggleBtn ) ){
						$('.kutuKategori .kutuHeaderKategori').attr('id', 'kategori');
						toggleBtn
						.removeAttr('onclick')
						.bind('click', function( e ){
							var ths = $( this ), id = ths.attr('id') || '', sib = ths.siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori');
							if( clicklable ){
								clicklable = false;
								if( ths.hasClass( _t['cls']['closed'] ) ){
									ths.removeClass( _t['cls']['closed'] ).parent('div').removeClass( _t['cls']['closed'] );
									sib.stop().slideDown( 333, 'easeInOutExpo', function(){ clicklable = true; });
									_t['closedObj'][ id ] = 1;
								}else{
									ths.addClass( _t['cls']['closed'] ).parent('div').addClass( _t['cls']['closed'] );
									sib.stop().slideUp( 333, 'easeInOutExpo', function(){ clicklable = true;	});
									_t['closedObj'][ id ] = 0;
								}
							}
						});
					}
					
					if( uty.detectEl( mobiBtn ) )
						mobiBtn.bind('click', function( e ){
							e.preventDefault();
							if( bdy.hasClass(  _t['cls']['ready'] ) )
								_t.popup('closed');
							else
								_t.popup('opened');
						});
					
					if( uty.detectEl( mobiCloseBtn ) )
						mobiCloseBtn.unbind('click').bind('click', function( e ){
							e.preventDefault();
							_t.popup('closed');
						});	
					
					if( history.pushState )
						window.onpopstate = function( event ){
							_t.ajx({ uri: event.state ? event.state.Url : window.location.href, target:_t['target']['list'] });						
						};	
				},
				ajx: function( o ){
					var _t = this, uri = o['uri'], target = o['target'], hP = o['historyPush'] || null;
						_t.loading('add');
					uty.ajx({ uri: uri }, function( k ){
						if( k['type'] == 'success' )
							_t.ajxResult({ val: k['val'], uri: uri, target: target, historyPush: hP  });	
						_t.loading('remove');							
					});
				},				
				ajxResult: function( o ){
					var _t = this, wrp = $( o['target'] ), e = $('<div>' + o['val'] + '</div>' ), target = e.find( o['target'] ), uri = o['uri'], ttl = e.find('title').text() || document.title;
					$('title').text( ttl );
	
					if( uty.detectEl( target ) && uty.detectEl( wrp ) ){
						
						var k = e.find('[id$="hdnUrnReferrerUrl"]').val() || '';
						if( k != '' )
							urlString = k;
						
						target.find('.kutuKategori .kutuHeaderKategori').attr('id', 'kategori');	
						$.each(_t.closedObj, function( i, k ){
							if( k == 0 )
								target.find('[id="'+ i +'"]').addClass( _t['cls']['closed'] ).siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori').hide();
							else
								target.find('[id="'+ i +'"]').removeClass( _t['cls']['closed'] ).siblings('.urunKiyaslamaOzellik_ozellikIcerik, .kutuBodyKategori').show();
						});	
	
						wrp.html( uty.clearScriptTag( target.html() ) );
						
						
						if( o['historyPush'] )
							history.pushState({ Url: uri , Page: ttl }, ttl, uri);
						
						setTimeout(function(){
							management.init();
							plugin.init();
							uty.unVeil( wrp );
							_t.init();
							modules.compare.set();
							addToFavorites.check();
							stage.dispatchEvent("CustomEvent", "ListLoaded");
						}, 10);
					}
				},
				setFilterClosed: function(){
					var _t = this, e = $('#dvUrunKiyaslamaOzellik.urunKiyaslamaOzellik_ozellik'), wrp = $( _t.wrp );
					
					if( !wrp.hasClass( _t.cls['control'] ) && uty.visibleControl() ){
						wrp.addClass( _t.cls['control'] );

						if( uty.detectEl( e ) )
							e
							.each(function(){
								var ths = $( this ), id = ths.find('.urunKiyaslamaOzellik_ozellikAd').attr('id') || ''; 
									ths.addClass('kapali').find('.urunKiyaslamaOzellik_ozellikAd').addClass('kapali').siblings('.urunKiyaslamaOzellik_ozellikIcerik').hide();
								if( id != '' )	
									_t['closedObj'][ id ] = 1;	
							});
						
						e = $('.kutuKategori');
						if( uty.detectEl( e ) )
							e.addClass('kapali').find('.kutuHeaderKategori').addClass('kapali').siblings('.kutuBodyKategori').hide();
					}
				},
				set: function(){
					var _t = this;
					$( '.' + _t['cls']['closed'] ).each(function(){ $( this ).parent('div').addClass( _t['cls']['closed'] ); });
					
					$('.urunKiyaslamaOzellik_ozellikAd, .kutuKategori .kutuHeaderKategori')
					.each(function(){
						var ths = $( this ), id = ths.attr('id') || '';
						if( id != '' ){
							if( ths.hasClass('kapali') ) _t['closedObj'][ id ] = 0;
							else _t['closedObj'][ id ] = 1;
						}
					});
				},
				setFilterQty: function(){
					var _t = this, e = $('.filter-popup .filter-qty');
					if( uty.detectEl( e ) )
						e
						.each(function(){
							var ths = $( this );
								ths.siblings('a').append( ths );
						});
				},
				filterSelection: function(){
					var _t = this, e = $('.kutuOzellikFiltre .link_selected'), wrp = $( _t.wrp );
					if( uty.detectEl( e ) ) wrp.addClass( _t.cls['filterSelected'] );
					else  wrp.removeClass( _t.cls['filterSelected'] );
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.wrp ) ) ){
						_t.filterSelection();
						_t.setFilterQty();
						_t.addEvent();
						_t.setFilterClosed();
						_t.set();
					}
				}
			},
			compare: {
				el: 'input[id$="chkOZS_KOD"]',
				contentWrp: '.compareHolder',
				content: '.compareHolder .compareContentList .ems-prd-list',
				countEl: '.compareHolder [rel="compareList"] .qty',
				target: '.emosInfinite',
				cls: { loading: 'compare-ajx-loading', noResult: 'compare-no-result', show: 'show-compare', prd: 'compare-prd-active' },
				uri: {
					list: '/usercontrols/kutu/ajxUrunTab.aspx?tip=seciliurun&ps=10&rp=10&lazyLoad=false&uKods={{uKods}}&lang={{lang}}&ozs={{ozs}}',
					compare: '/urun_kiyaslama.aspx?uKods={{uKods}}&lang={{lang}}&ozs={{ozsKods}}'
				},
				maxComp: parseFloat( $('.compareHolder').attr('data-prdmax') || 4 ),
				uKods: '',
				ozsKods: '',
				getUri: function( o ){
					var _t = this, cat = uty.getCat() || '';
					if( cat != '' )
						cat = 'kat=' + cat + '&';
					return _t.uri[ o['typ'] || 'list' ].replace(/{{uKods}}/, o['uKods'] || '').replace(/{{ozs}}/, o['ozsKod'] || '').replace(/{{lang}}/, lang).replace(/{{kat}}/, cat).replace(/{{ozsKods}}/, _t.ozsKods);
				},
				loading: function( k ){
					var _t = this;
					if( k == 'add' ) bdy.addClass( _t['cls']['loading'] );
					else bdy.removeClass( _t['cls']['loading'] );
				},
				getUKods: function( callback ){
					var _t = this;
					uty.ajx({ uri: '/pageMethods.aspx/kiyaslaUrunKodlarAl', type: 'post', dataType: 'json', contentType: 'application/json; charset=utf-8' }, function( d ){ 
						if( d['type'] == 'success' ){
							var d = uty.trimText( d['val']['d'] ), o = {};
							if( d != '' ){
								var u = d.split(':')[ 1 ], ozs = d.split(':')[ 0 ]; 
									u = u.endsWith(',') ? u.substr( 0, u.length - 1 ) : u; 
								o['uKods'] = u;
								o['ozsKod'] = ozs;
								o['typ'] = 'list';
								
								_t.ozsKods = ozs;
							}
							if( typeof callback !== 'undefined' )
								callback( o );	
						}
					});	
				},
				add: function(){
					var _t = this;
						_t.loading('add');
						_t.getUKods(function( o ){
							var u = o['uKods'] || '';
							_t.uKods = u;
							if( u != '' ){
								var uri = _t.getUri( o );
								uty.ajx({ uri: uri }, function( d ){ 
									if( d['type'] == 'success' )
										_t.ajxResult( uty.clearScriptTag( d['val'] ) );		
									_t.loading('remove');
								});
							}else{
								_t.loading('remove');
								_t.ajxResult();
							}
							
						});
				},
				ajxResult: function( o ){
					var _t = this, k = o || '';
					if( k != '' ){
						k = $( k ).find( _t.target ).wrapAll('<div>').parent().html(); 
						
						if( $('#hdnOZS_KOD').val() != $( k ).find('#hdnOZS_KOD').val() )
							strOzsKodState = true;
						else
							strOzsKodState = false;	
					}
					
					
					
					$( _t.content ).html( k );
					_t.set();
					_t.setChk();
				},
				
				set: function(){ 	
					var _t = this, el = $( _t.el ), cw = $( _t.contentWrp ), countEl = $( _t.countEl ), count = $('> ul > li', _t.content ).length;
					el
					.unbind('change')
					.bind('change', function(){
						var ths = $( this ); 
						
						strThis = ths.get( 0 );/* sistem değişkenine eşitleriz */
						
						if( _t.uKods.split(',').length >= _t.maxComp && ths.is(':checked') ){
							setTimeout(function(){ ths.attr('checked', false).siblings('.cStyler').removeClass('checked'); }, 10);
							alert( $('[id$="lbfKIYASLAMA_VLDMAX"]').text().replace('$maxCompare$', _t.maxComp) );
							if (typeof stage !== 'undefined') 
								stage.dispatchEvent("CustomEvent", "itemCompareClear", { 'type': ths.value });
						}else{
							var id = ths.val() + ',' + ths.is(':checked');
           					pageMethod("/pageMethods.aspx/kiyaslaUrunEkle", '{"urn":"' + id + '", "ozsKodState":"' + strOzsKodState + '"}', kiyaslaUrunEkleSuccess, kiyaslaUrunEkleError);  
						}						
					});
					//compareChkChange();/* sys. func */
					
					countEl.text( count );
					if( count == 0 ) bdy.addClass( _t['cls']['noResult'] ).removeClass( _t['cls']['prd'] );
					else bdy.removeClass( _t['cls']['noResult'] ).addClass( _t['cls']['prd'] );
					
					_t.setChk();
				},
				setChk: function(){
					var _t = this, arr = _t.uKods.split(','), el = $( _t.el );
					
					if( uty.detectEl( el ) )
						el.attr('checked', false).siblings('.cStyler').removeClass('checked');
					
					for( var i = 0; i < arr.length; ++i ){
						el = $( _t.el + '[value="'+ arr[ i ] +'"]' );
						if( uty.detectEl( el ) )
							el.attr('checked', true).siblings('.cStyler').addClass('checked');
					}
				},
				addEvent: function(){
					var _t = this, clrBtn = $('.compareHolder .btnClear'), compareBtn = $('.compareHolder .btnCompare'), toggleBtn = $('.compareHolder .openCloseBtn');
					
					clrBtn.bind('click', function(){
						_t.loading('add');
						uty.ajx({ uri: '/pageMethods.aspx/kiyaslaUrunKodlarTemizle', type: 'post', dataType: 'json', contentType: 'application/json; charset=utf-8' }, function( d ){ 
							_t.uKods = '';
							_t.ajxResult();
							_t.loading('remove');
						});
					});
					
					compareBtn.bind('click', function(){
						var u = _t.uKods.split(',');
						if( u.length > 1 )
							location.href = _t.getUri({ typ: 'compare', uKods: _t.uKods }); 
						else 
							alert( translation['compareVld'] );	
					});
					
					toggleBtn.bind('click', function(){
						bdy.toggleClass( _t['cls']['show'] );
					});
				},
				init: function(){
					var _t = this, el = $( _t.el );
					if( uty.detectEl( el ) ){
						doc.ready(function( e ){ setTimeout(function(){ _t.set(); }, 1); });
						//bdy.append('<div class="compareHolder"> <div class="compareMenuHolder"> <div class="compareMenu"> <i class="openCloseBtn"><span class="addItems">Ürün Ekle</span></i> <ul> <li class="tab-2" rel="compareList"><span class="tabBtn">Karşılaştırma Listesi <small></small></span><a class="btnDefault btnCompare"><span>Karşılaştır</span></a> <a class="btnDefault btnClear" href="javascript:void(0);"><span class="clear">Temizle</span></a> </li></ul> <div class="floatFixer"></div></div></div><div class="compareContent"> <div class="compareContentList"></div></div></div>');	
						_t.add();
						_t.addEvent();
					}
				}
			},
			view360: {
				current: null,
				cls: { ready: 'popup-360-ready', animate: 'popup-360-animate', ready360: 'on-ready' },
				el: { wrp: '.ems-page-product-detail', view: '.view360', btn: '.view-360-btn', closeBtn: 'popup-360-vail, .popup-360 .btn-close' },
				uri: '/upload/360/{{prdCode}}/',
				getUri: function(){
					var _t = this;
					return _t.uri.replace(/{{prdCode}}/g, obj360['imagePath'] || '');
				},
				initPlugins: function(){
					var _t = this, view = $( _t.el.view );
					if( _t.current === null && uty.detectEl( view ) )
						_t.current = view.ThreeSixty({
										totalFrames: obj360['totalFrames'] || 37,
										endFrame: obj360['endFrame'] || 37,
										currentFrame: obj360['currentFrame'] || 1,
										imgList: '.threesixty_images',
										progress: '.spinner',
										imagePath: _t.getUri(),
										filePrefix: '',
										ext: '.jpg',
										height: obj360['height'] || 1080,
										width: obj360['width'] || 1080,
										navigation: true,
										responsive: true,
										onReady:function(){
											view.addClass( _t.cls['ready360'] );
										},
										onDragStart:function(){
											console.log('onDragStart', _t.current.getCurrentFrame() );
										},
										onDragStop:function(){
											console.log('onDragStop', _t.current.getCurrentFrame() );
										}
									});
					else
						win.resize();				
				},
				animate: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 333, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });		
				},
				addEvent: function(){
					var _t = this;
					
					$( _t.el.btn )
					.bind('click', function(){
						_t.animate('opened');
						setTimeout(function(){ _t.initPlugins(); }, 10);		
					});
					
					$( _t.el.closeBtn )
					.bind('click', function( e ){
						e.preventDefault();
						_t.animate('closed');
					});
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.wrp ) ) && typeof obj360 !== 'undefined' )
						_t.addEvent();
				}
			},
			contentPopup: {
				cls: { ready: 'campaign-popup-ready', animate: 'campaign-popup-animate' },
				el: { btn: '.campaign-wrapper .more-info', closeBtn: '.campaign-popup .btn-close', content: '.campaign-popup .ems-popup-content-wrap' },
				animate: function( k ){
					var _t = this;
					if( k == 'opened' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });		
				},
				addEvent: function(){
					var _t = this, btn = $( _t.el.btn ), closeBtn = $( _t.el.closeBtn );
					btn
					.bind('click', function( e ){
						e.preventDefault();
						var ths = $( this ), k = $('.single[rel="'+ ( ths.attr('data-id') || '' ) +'"]');
						if( uty.detectEl( k ) ){
							$( _t.el.content ).html( k.html() );
							_t.animate('opened');
						}
					});
					
					closeBtn
					.bind('click', function( e ){
						e.preventDefault();
						_t.animate('closed');
					});
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.btn ) ) )
						_t.addEvent();
				}
			},
			menuCat: {
				el: '.menuKategori, .kutuBodySolMenuTree, .accordion-sub',
				cls: { subitems: 'sub-items', opened: 'opened' },
				speed: 333,
				addEvent: function(){
					var _t = this, el = $( _t.el );
					el.find('li > b').bind('click', function(){
						var ths = $( this ), prt = ths.parent('li');
						if( prt.hasClass( _t.cls['opened'] ) ){
							prt.removeClass( _t.cls['opened'] );
							prt.siblings('li').removeClass( _t.cls['opened'] );
						}else{
							prt.siblings('li').removeClass( _t.cls['opened'] );
							prt.addClass( _t.cls['opened'] );
						}
					});
				},
				set: function(){
					var _t = this, el = $( _t.el );
					el.find('li').each(function(){
						var ths = $( this );
						if( uty.detectEl( ths.find('> ul') ) )
							ths.addClass( _t.cls['subitems'] );
					});	
				},
				control: function(){
					var _t = this, el = $( _t.el ).find('li.act');
					if( uty.detectEl( el ) ){
						el.addClass( _t.cls['opened'] );
						el.parents('li').addClass( _t.cls['opened'] );
					}
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el ) ) ){
						_t.set();
						_t.control();
						_t.addEvent();
					}
				}
			},
			customSearch: {
				cls: { ready: 'search-ready', animate: 'search-animate', fxd: 'search-fixed', fxdReady: 'search-fixed-ready', focused: 'search-focused', keyup:'search-keyup', found: 'search-result-found', noResult: 'search-no-result' },
				wrp: '.mod-mini-search',
				btn: '.mod-mini-search .btnSearch, .mod-mini-search .btnSearchBack',
				input: '[id$="txtARM_KEYWORD"]',
				addEvent: function(){
					var _t = this, input = $( _t.input ), e = $( _t.btn );
					
					if( uty.detectEl( e ) )
						e
						.bind('click', function(){
							var ths = $( this );
							if( bdy.hasClass( _t.cls['ready'] ) ){
								_t.animate('close');
								input.blur();
							}else{
								_t.animate('open');
								input.focus();
							}
						});
						
					e = $('.mSearchBtn > a');
					if( uty.detectEl( e ) )
						e
						.bind('click',function(){
							bdy.toggleClass( _t.cls['fxdReady'] );
						});
					
					input
					.bind('focus', function(){
						bdy.addClass( _t.cls['focused'] );
					})
					.bind('blur', function(){
						var ths = $( this ), val = uty.cleanText( ths.val() );
						if( val.length == 0 )
							bdy.removeClass( _t.cls['focused'] ).removeClass( _t.cls['keyup'] ).removeClass( _t.cls['found'] ).removeClass( _t.cls['noResult'] );
					})
					.bind('keyup', function(){
						var ths = $( this ), val = uty.cleanText( ths.val() );
						if( val.length > 0 )
							bdy.addClass( _t.cls['keyup'] );
						else
							bdy.removeClass( _t.cls['keyup'] );	
					});
					
					doc.bind('keyup',function( evt ){
						evt = evt || window.event;
						var isEscape = false;
						if( "key" in evt )
							isEscape = ( evt.key == "Escape" || evt.key == "Esc" );
						else
							isEscape = (evt.keyCode == 27);
						
						if( isEscape )
							_t.destroy();
					});
					
					/* https://codepen.io/Momciloo/pen/bpyMbB */
					if( !isMobile )
						input.on('input', function() {
							var ths = $( this ), inputWidth = ths.textWidth();
								ths.css({ width: inputWidth });
						});
					
					e = $('.btnTextRemove');
					if( uty.detectEl( e ) )
						e
						.bind('click', function(){
							var ths = $( this );
							input.val('');
							setTimeout(function(){ 
								input.css({ 'width': '' });  
							}, 100);
							bdy.removeClass( _t.cls['focused'] ).removeClass( _t.cls['keyup'] ).removeClass( _t.cls['found'] ).removeClass( _t.cls['noResult'] );
						});
				},
				animate: function( k ){
					var _t = this;
					if( k == 'open' )
						uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[_t.cls['ready'], _t.cls['animate']] });
					else
						uty.cssClass({ 'ID': 'body', 'delay': 444, 'type': 'remove', 'cls':[_t.cls['animate'], _t.cls['ready']] });		
				},
				destroy: function(){
					var _t = this, input = $( _t.input );
					bdy.removeClass( _t.cls['ready'] ).removeClass( _t.cls['animate'] ).removeClass( _t.cls['focused'] ).removeClass( _t.cls['keyup'] );
					input.val('').blur();
					setTimeout(function(){ input.css({ 'width': '' }); }, 100);
					if( typeof HideSuggestionsDiv !== 'undefined' )
						HideSuggestionsDiv();
				},
				set: function(){
					/* sistem arama kutusunu ezmek */
					var e = $('[id$="txtARM_KEYWORD"]');
					if( uty.detectEl( e ) ){
						e.get( 0 ).removeEventListener("blur", onFocusLost);
						e.bind('keyup', function(){
							var ths = $( this );
								ths.val( ths.val().replace(/ +(?= )/g,'') );
						});
					}
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.wrp ) ) ){
						_t.set();
						_t.addEvent();
					}
				}
			},
			documentDownload: {
				cls: { loading: 'ajx-loading', showSugg: 'show-sugg', noResultSugg: 'no-result-sugg', showDoc: 'show-doc', noResultDoc: 'no-result-doc', showed: 'showed' },
				el: { wrp: '.ems-page-download', input: '.model-no-search .ems-form-obj input[type="text"]', suggContent: '.model-no-search .ems-form-obj .sugg-content .inner', docContentModelWrp: '.model-no-search', docContentKatWrp: '.category-search', docContentModel: '.model-no-search .grid-doc-result', docContentKat: '.category-search .grid-doc-result', catSearch: '.category-search', catSearchBtn: '.category-search .btn', catLvl1: '.category-search .catlvl1 select', catLvl2: '.category-search .catlvl2 select', catLvl3: '.category-search .catlvl3 select' },
				uri: {
					kyw: '/docs-prd-sugg-ajx.html?kyw={{val}}',
					id: '/get-docs-exp.html?lng={{lang}}&id={{val}}',
					old: '/get-old-docs-exp.html?lng={{lang}}&id={{val}}',
					kat: '/get-docs-by-cat-exp.html?kat={{val}}&lng={{lang}}'
				},
				getURI: function( o ){
					var _t = this, val = o['val'] || '', typ = o['typ'] || '';
					return _t.uri[ typ ].replace(/{{val}}/g, val).replace(/{{lang}}/g, lang);
				},
				begin: 3,
				delay: 333,
				stm: null,
				clearTm: function(){
					var _t = this;
					if( _t.stm !== null )
						clearTimeout( _t.stm );
				},
				loading: function( k ){
					var _t = this, wrp = $( _t.el.wrp );
					if( k == 'add' ) 
						wrp.addClass( _t.cls['loading'] );
					else 
						wrp.removeClass( _t.cls['loading'] );	
				},
				contentAdd: function( o ){
					var _t = this, wrp = $( o['wrp'] || '' ), docContent = $( o['ID'] || '' );
					
					_t.loading('add');	
					uty.ajx({ uri: _t.getURI({ val: o['val'] || '', typ: o['typ'] || '' }) }, function( d ){
						
						if( d['type'] == 'success' ){
							var k = uty.trimText( d['val'] || '' );
							docContent.html( k );
							if( k != '' ){
								wrp.addClass( _t.cls.showDoc ).removeClass(  _t.cls.noResultDoc  ).find('.result-qty b.search-text').html( o['txt'] || o['val'] || '' );
								wrp.find('.result-qty b.search-qty').html( docContent.find('> div').length )
							}else
								wrp.removeClass( _t.cls.showDoc ).addClass(  _t.cls.noResultDoc  ).find('.no-result b').html( o['txt'] || o['val'] || '' )
								//wrp.removeClass( _t.cls.showDoc ).addClass(  _t.cls.noResultDoc  ).find('.result-qty b.search-text').html( o['txt'] || o['val'] || '' );	
						}else{
							wrp.removeClass( _t.cls.showDoc ).removeClass(  _t.cls.noResultDoc  );
							docContent.html('');
						}
							
						_t.loading('remove');
					});
					
				},
				contentAddEvent: function(){
					var _t = this, wrp = $( _t.el.wrp );
					
					$( _t.el.suggContent )
					.find('.ems-grid-row')
					.unbind('click')
					.bind('click', function(){
						var ths = $( this ), rel = ths.attr('rel') || '', typ = 'id';
						if( rel == '' ){
							rel = ths.attr('title') || '';
							typ = 'old';
						}
							
						if( rel != '' )
							_t.contentAdd({ wrp: _t.el.docContentModelWrp, ID: _t.el.docContentModel, val: encodeURIComponent( rel ), typ: typ, txt: ths.find('.ems-grid-name').text() || '' });
					});
					
				},
				addEvent: function(){
					var _t = this, wrp = $( _t.el.docContentModelWrp ), suggContent = $( _t.el.suggContent ), catSearch = $( _t.el.catSearch ), catLvl1 = $( _t.el.catLvl1 ), catLvl2 = $( _t.el.catLvl2 ), catLvl3 = $( _t.el.catLvl3 );
					
					$( _t.el.input )
					.bind('keyup paste', function(){
						var ths = $( this ), val = uty.trimText( ths.val() || '' );
						_t.clearTm();
						if( val.length >= _t.begin ){
							_t.stm = setTimeout(function(){
								_t.loading('add');
								uty.ajx({ uri: _t.getURI({ val: val, typ: 'kyw' }) }, function( d ){
									if( d['type'] == 'success' ){
										var k = uty.trimText( d['val'] || '' );
										suggContent.html( k );
										if( k != '' ){
											wrp.addClass( _t.cls.showSugg ).removeClass(  _t.cls.noResultSugg  );
											_t.contentAddEvent();
										}else{
											wrp.removeClass( _t.cls.showSugg ).addClass(  _t.cls.noResultSugg  ).find('.no-result b').html( val || '' );	
											$( _t.el.docContentModelWrp ).removeClass( _t.cls.showDoc ).removeClass(  _t.cls.noResultDoc  );
											$( _t.el.docContentModel ).html('');
										}
									}else{
										wrp.removeClass( _t.cls.showSugg ).removeClass(  _t.cls.noResultSugg  );
										suggContent.html('');
									}
										
									_t.loading('remove');
								});
							}, _t.delay);
						}else{
							wrp.removeClass( _t.cls.showSugg ).removeClass(  _t.cls.noResultSugg  );
							suggContent.html('');
							
							$( _t.el.docContentModelWrp ).removeClass( _t.cls.showDoc ).removeClass(  _t.cls.noResultDoc  );
							$( _t.el.docContentModel ).html('');
						}
					});
					
					/*
					2630
					5088
					5845
					2487
					2485
					*/
					
					/* */
					
					
					var hideOptions = function( ID ){
						setTimeout(function(){
							ID.find('option').each(function(){
								var ths = $( this ), prt = ths.parent('span');
								if( prt.length == 0 )
									ths.wrapAll('<span></span>');
							});
							setTimeout(function(){
								ID.find('option').each(function(){
									var ths = $( this ), prt = ths.parent('span');
									if( ths.hasClass( _t.cls['showed'] ) || ths.val() == 0 ){
										prt.after( ths );
										prt.remove();
									}
								});								
							}, 222);
						}, 50);
					};
					
					catLvl1
					.unbind('change')
					.bind('change', function(){
						var ths = $( this );
						catLvl2.val( 0 ).find('option').add( catLvl3.val( 0 ).find('option') ).removeClass( _t.cls['showed'] );
						catLvl2.find('option[rel="'+ ths.val() +'"]').addClass( _t.cls['showed'] );
						
						hideOptions( catLvl2 );
						hideOptions( catLvl3 );
						
					});
					
					catLvl2
					.unbind('change')
					.bind('change', function(){
						var ths = $( this );
						catLvl3.val( 0 ).find('option').removeClass( _t.cls['showed'] );
						catLvl3.find('option[rel="'+ ths.val() +'"]').addClass( _t.cls['showed'] );
						
						hideOptions( catLvl3 );
					});
					
					hideOptions( catLvl2 );
					hideOptions( catLvl3 );
					
					$( _t.el.catSearchBtn )
					.bind('click', function(){
						
						var ths = $( this ), c1 = catLvl1.val(), c2 = catLvl2.val(), c3 = catLvl3.val(), val = 0, arr = [];
						if( c1 != 0 ){
							val = c1;
							arr.push( catLvl1.find('option:selected').text() || '' );
						}
						if( c2 != 0 ){
							val = c2;
							arr.push( catLvl2.find('option:selected').text() || '' );
						}
						if( c3 != 0 ){
							val = c3;
							arr.push( catLvl3.find('option:selected').text() || '' );
						}
						if( val == 0 ){
							alert( translation['catSearchAlert'] || 'Lütfen bir kategori seçiniz.' );
							return false;
						}else
							_t.contentAdd({ wrp: _t.el.docContentKatWrp, ID: _t.el.docContentKat, val: val, typ: 'kat', txt: arr.toString().replace(/\,/g, ', ') });						
					});
				},
				
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.wrp ) ) )
						_t.addEvent();
				}
			},
			showPassBtn: {
				cls: { show: 'show-pass' },
				el: { input: '[id$="txtUYE_SIFREYENI"]', prts: '.ems-field', btn: '.showPassBtn' },
				addEvent: function(){
					var _t = this;
					$( _t.el.btn )
					.bind('click', function(){
						var ths = $( this ), prt = ths.parents( _t.el.prts ).eq( 0 ), input = prt.find( _t.el.input );
						if( uty.detectEl( input ) ){  
							if( prt.hasClass( _t.cls['show'] ) ){
								prt.removeClass( _t.cls['show'] );
								input.prop('type', 'password');
							}else{
								prt.addClass( _t.cls['show'] );
								input.prop('type', 'text');
							}		
						}
					});	
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.btn ) ) )
						_t.addEvent();
				}
			},
			strongPass: {
				cls: { 'short': 'short', 'weak': 'weak', 'good': 'good', 'strong': 'strong' },
				el: { input: '[id$="txtUYE_SIFREYENI"]', prts: '.ems-field' },
				begin: 6,
				addEvent: function(){
					var _t = this, input = $( _t.el.input );
					input
					.bind('keyup', function(){
						var ths = $( this ), prt = ths.parents( _t.el.prts ).eq( 0 ), k = ths.val() || '', strength = 0;
						
						if( k.length <= 0 ){
							prt.removeClass( _t.cls['short'] ).removeClass( _t.cls['weak'] ).removeClass( _t.cls['good'] ).removeClass( _t.cls['strong'] );
							return false;
						}
						
						if( k.length < _t.begin ){
							prt.addClass( _t.cls['short'] ).removeClass( _t.cls['weak'] ).removeClass( _t.cls['good'] ).removeClass( _t.cls['strong'] );
							return false;
						}
						
						if( k.length > _t.begin + 1 ) strength += 1;
						
						//If password contains both lower and uppercase characters, increase strength value.
						if( k.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/) ) strength += 1;
						
						//If it has numbers and characters, increase strength value.
						if( k.match(/([a-zA-Z])/) && k.match(/([0-9])/) ) strength += 1; 
						
						//If it has one special character, increase strength value.
						if( k.match(/([!,%,&,@,#,$,^,*,?,_,~])/) ) strength += 1;
						
						//if it has two special characters, increase strength value.
						if( k.match(/(.*[!,%,&,@,#,$,^,*,?,_,~].*[!,%,&,@,#,$,^,*,?,_,~])/) ) strength += 1;
						
						
						if( strength < 2 )
							prt.addClass( _t.cls['weak'] ).removeClass( _t.cls['short'] ).removeClass( _t.cls['good'] ).removeClass( _t.cls['strong'] );
						else if (strength == 2 )
							prt.addClass( _t.cls['good'] ).removeClass( _t.cls['short'] ).removeClass( _t.cls['weak'] ).removeClass( _t.cls['strong'] );
						else
							prt.addClass( _t.cls['strong'] ).removeClass( _t.cls['short'] ).removeClass( _t.cls['weak'] ).removeClass( _t.cls['good'] );
							
					});	
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.input ) ) )
						_t.addEvent();
				}	
			},
			pagination: {
				cls: { show: 'show' },
				el: { wrp: '.ems-grid-concept-store', pgWrp: '.ems-pagination', target: '.ems-grid-concept-store 	> .ems-grid-row' },
				template: '<div class="ems-pagination"></div>',
				showed: function( pageNumber ){
					var _t = this, total = $( _t.el.target ).length, pg = $( _t.el.wrp ).attr('data-view') || 50, end = pg * pageNumber, begin = end - pg;

					if( end >= total )
						end ++;
							
					$( _t.el.target )
					.removeClass( _t.cls['show'] )
					.each(function( i, k ){
						var ths = $( this );	
						
						if( i >= begin &&  i < end )
							ths.addClass( _t.cls['show'] );
					});
				},
				initPlugins: function(){
					var _t = this, total = $( _t.el.target ).length, pg = $( _t.el.wrp ).attr('data-view') || 50;

					$( _t.el.pgWrp ).pagination({
						items: total,
						itemsOnPage: pg,
						currentPage: 1,
						prevText: '',
						nextText: '',
						onPageClick: function( pageNumber, event ){
							event.preventDefault();
							_t.showed( pageNumber );
							uty.pageScroll({ scrollTop: $( _t.el.wrp ).offset().top });
						}
					});
					
					_t.showed( 1 );
				},
				add: function(){
					var _t = this;
					$( _t.el.wrp ).after( _t.template );
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.wrp ) ) ){
						_t.add();
						_t.initPlugins();
					}	
				}
			},
			customForm: {
				cls: { active: 'active', success: 'success', err: 'ems-form-err', opened: 'opened' },
				el: { wrp: '.ems-page-services-form', nav: '.categories ul li', btn: '.ems-form .step-footer a', step: '.ems-form .step', err: '.ems-form-err', errMsg: '.ems-form-err-msg', activeTitle: '.categories .menu-title' },
				clearErr: function(){
					var _t = this, err = $( _t.el.err );
					if( uty.detectEl( err ) )
						err.removeClass( _t.cls.err ).find( _t.el.errMsg ).remove();	
				},
				activeTitle: function( k ){
					var _t = this;
					$( _t.el.activeTitle ).html( k );
				},
				addEvent: function(){
					var _t = this, e = $( _t.el.nav );
					
					if( uty.detectEl( e ) )
						e
						.bind('click', function(){
							var ths = $( this ), rel = ths.attr('rel') || '', stp = $( _t.el.step + '[id="'+ rel +'"]' ), active = $( _t.el.step + '.' + _t.cls['active'] );
							/*if( uty.detectEl( active ) )
								if( !formValidation( active.attr('id') || '' ) ){
									active.removeClass( _t.cls['success'] );
									return false;
								}*/
							
							if( stp.hasClass( _t.cls['success'] ) || stp.prev().hasClass( _t.cls['success'] ) ){
								ths.add( stp ).addClass( _t.cls['active'] ).siblings().removeClass( _t.cls['active'] );
								_t.activeTitle( ths.text() || '' );
							}
							$( _t.el.activeTitle ).parents('.categories').eq( 0 ).removeClass( _t.cls['opened'] );
						});
					
					e = $( _t.el.btn );
					if( uty.detectEl( e ) )
						e
						.bind('click', function(){
							var ths = $( this ), prt = ths.parents('.step').eq( 0 ), nxt = prt.next(), rel = prt.attr('id') || '', nxtRel = nxt.attr('id') || '';
							
							if( !formValidation( rel ) ){
								prt.removeClass( _t.cls['success'] );
								return false;
							}
							
							_t.clearErr();
							prt.addClass( _t.cls['success'] );
							
							if( nxtRel != '' && uty.detectEl( nxt ) ){
								nxt.add( $( _t.el.nav + '[rel="'+ nxtRel +'"]' ) ).addClass( _t.cls['active'] ).siblings().removeClass( _t.cls['active'] );
								_t.activeTitle( $( _t.el.nav + '[rel="'+ nxtRel +'"]' ).text() || '' );
								uty.pageScroll({ scrollTop: 0 });
							}
						});
					
					e = $( _t.el.activeTitle ); 
					if( uty.detectEl( e ) ){
						e
						.bind('click', function(){
							var ths = $( this );
								ths.parents('.categories').eq( 0 ).toggleClass( _t.cls['opened'] );
						});
						_t.activeTitle( $( _t.el.nav + '.active' ).text() || '' );
					}
					
					/* türkiye seçili gelsin */	
					e = $('[id$="lstprm_il"]');
					if( uty.detectEl( e ) )
						e.val( 1 ).change();
					
					/* buton taşı */	
					management.append.set({ 'main': '.ems-page-services-form .xmlForm_btnGonder', 'target': '.step.step-7 .step-footer', 'add': 'append' });		
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.wrp ) ) )
						_t.addEvent();
				}
			},
			frmPopup: {
				getLnk: function( k ){ return k.replace(/{{lang}}/g, lang).replace(/{{page-link}}/g, window.location.href); },
				clicked: function( k ){
					var _t = this, ths = $( k ), lnk = _t.getLnk( ths.attr('data-lnk') || '' ), dw = ths.attr('data-width') || 1060, dh = ths.attr('data-height') || 540, cls = ths.attr('data-cls') || 'custom-frm-popup';
					if( lnk != '' )
						bdy.minusPopup({ type: 'iframe', content: lnk, openWith: 'auto', width: dw, height: dh, customClass: cls, closeWith:'#minHider, .btnMinPpCl' });
				}
			},
			cntPopup: {
				clicked: function( k ){
					var _t = this, ths = $( k ), cnt = $( ths.attr('data-content') || '' ).eq( 0 ), dw = ths.attr('data-width') || 1060, dh = ths.attr('data-height') || 540, cls = ths.attr('data-cls') || 'custom-cnt-popup';
					if( uty.detectEl( cnt ) )
						bdy.minusPopup({ type: 'content', content: cnt.html() || '', openWith: 'auto', width: dw, height: dh, customClass: cls, closeWith:'#minHider, .btnMinPpCl' });
				}
			},
			searchText: {
				el: { wrp: '.ems-page-search-result', input: '.search-text .c-input', searchBtn: '.search-text .a-search', clearBtn: '.search-text .a-close' },
				addEvent: function(){
					var _t = this, input = $( _t.el.input );
					
					input
					.bind('blur', function(){
						var ths = $( this );
						$('.tableArama [id$="urun_txtKEYWORD"]').val( uty.trimText( ths.val() || '' ) );
					})
					.bind('keypress', function( e ){
						var ths = $( this ), code = e.keyCode || e.which;
						if( code == 13 ){
							$('.tableArama [id$="urun_txtKEYWORD"]').val( uty.trimText( ths.val() || '' ) );
							$('[id$="urun_validatingForm"] .btnAra').get( 0 ).click();
						}
					});
					
					$( _t.el.searchBtn )
					.bind('click', function(){ $('[id$="urun_validatingForm"] .btnAra').get( 0 ).click();	});
					
					$( _t.el.clearBtn )
					.bind('click', function(){ 
						input.val('');
						$('[id$="urun_validatingForm"] .btnTemizle').get( 0 ).click();	
					});	
				},
				add: function(){
					var _t = this, txt = minusLoc.get('?', 'text', urlString), input = $( _t.el.input );
					input.val( $('[id$="urun_validatingForm"] [id$="txtKEYWORD"]').val() || txt || '' );
				},
				init: function(){
					var _t = this;
					if( uty.detectEl( $( _t.el.wrp ) ) ){
						_t.add();
						_t.addEvent();
					}
				}
			},
			adjust: function(){
				var _t = this;
					_t.prdCompact.adjust();
			},
			onScroll: function(){
				var _t = this;
					_t.prdCompact.adjust();
			},
			init: function(){
				var _t = this;
					_t.view360.init();
					_t.crediCart.init();
					_t.prdCompact.init();
					_t.mobiMenu.init();
					_t.login.init();
					_t.cart.init();
					_t.filter.init();
					_t.compare.init();
					_t.contentPopup.init();
					_t.menuCat.init();
					_t.customSearch.init();
					_t.documentDownload.init();
					_t.strongPass.init();
					_t.showPassBtn.init();
					_t.pagination.init();
					_t.customForm.init();
					_t.searchText.init();
			}
			
	},
	pages = {
		technologies: {
			cls: { filterReady: 'technologies-filter-ready', filterAnimate: 'technologies-filter-animate', labelReady: 'technologies-label-ready', labelAnimate: 'technologies-label-animate' },
			el: { wrp: '.ems-page-technologies', btnFilter: '.filterPopup', closeFilter: '.btn-filter-close', btnLabel: '.labelPopup', closeLabel: '.btn-label-close' },
			animate: function( o ){
				var _t = this, typ = o['typ'] || '';
				if( typ == 'opened' )
					uty.cssClass({ 'ID': 'body', 'delay': 100, 'type': 'add', 'cls':[o['ready'], o['animate']] });
				else
					uty.cssClass({ 'ID': 'body', 'delay': 400, 'type': 'remove', 'cls':[o['animate'], o['ready']] });	
			},
			addEvents: function(){
				var _t = this, wrp = $( _t.el.wrp );
				
				wrp
				.find( _t.el.btnFilter )
				.bind('click', function(){
					if( bdy.hasClass( _t.cls['filterReady'] ) )
						_t.animate({ typ: 'closed', ready: _t.cls['filterReady'], animate: _t.cls['filterAnimate'] })
					else
						_t.animate({ typ: 'opened', ready: _t.cls['filterReady'], animate: _t.cls['filterAnimate'] })
				});
				
				wrp
				.find( _t.el.closeFilter )
				.bind('click', function(){
					_t.animate({ typ: 'closed', ready: _t.cls['filterReady'], animate: _t.cls['filterAnimate'] })
				});
				
				wrp
				.find( _t.el.btnLabel )
				.bind('click', function(){
					if( bdy.hasClass( _t.cls['labelReady'] ) )
						_t.animate({ typ: 'closed', ready: _t.cls['labelReady'], animate: _t.cls['labelAnimate'] })
					else
						_t.animate({ typ: 'opened', ready: _t.cls['labelReady'], animate: _t.cls['labelAnimate'] })
				});
				
				wrp
				.find( _t.el.closeLabel )
				.bind('click', function(){
					_t.animate({ typ: 'closed', ready: _t.cls['labelReady'], animate: _t.cls['labelAnimate'] });
				});
				
			},
			add: function(){
				var _t = this, e = $('.icerikTemplateListeEtiket');
				if( uty.detectEl( e ) )
					e
					.each(function(){
                        var ths = $( this ), sib = ths.prev('.icerikTemplateListeItem');
						sib.find('.tags .tag-title').after( ths );
                    });
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el.wrp ) ) ){
					_t.add();
					_t.addEvents();
				}
			}
		},
		main: {
			el: '.ems-page-home',
			initPlugins: function(){
				uty.hoverVideo.init();	
			},
			init: function(){
				var _t = this, el = $( _t.el );
				if( uty.detectEl( el ) ){
					_t.initPlugins();
				}	
			}
		},
		detail: {
			cls: { opened: 'opened', noComment: 'no-comment' },
			wrp: '.ems-page-product-detail',
			addEvent: function(){
				var _t = this, e = $('.prd-info-tab .content-js > li').eq( 0 );
				if( uty.detectEl( e ) )
					e.addClass('selected');
				
				e = $('#lnkTaksitSecenek');
				if( uty.detectEl( e ) )
					e
					.bind('click', function( e ){
						e.preventDefault();
						var k = $('.prd-info-tab .content-js > li[rel="tab3"]');
						if( uty.detectEl( k ) )
							k.removeClass('selected').find('> a').get( 0 ).click();
					});
				
				e = $('.mod-seller-options > ul > li > a');
				if( uty.detectEl( e ) )
					e
					.bind('click', function(){
						var ths = $( this ), prt = ths.parents('li').eq( 0 );
						if( prt.hasClass( _t.cls['opened'] ) )
							prt.add( prt.siblings() ).removeClass( _t.cls['opened'] );
						else
							prt.addClass( _t.cls['opened'] ).siblings().removeClass( _t.cls['opened'] );	
					});
				
				e = $('.inner-row-2 .yorumOrtalamaPuan');
				if( uty.detectEl( e ) )
					e
					.bind('click', function(){
						var k = $('.content-js > [rel$="tab4"]');
						if( uty.detectEl( k ) )
							k.removeClass('selected').find('> a').get( 0 ).click();
					});		
			},
			ready: function(){
				var e = 	$('[id$="lbfYORUMFILTRE_TUMU"]');
				if( uty.detectEl( e ) )	
					e.get( 0 ).click();		
			},
			add: function(){
				var _t = this, hrf = window.location.href, e = $('.ems-page-product-detail .share-it a[data-type]:not([data-type="shortLnk"])');
				if( uty.detectEl( e ) )
					e.attr('onclick', 'modules.social.share(this);').attr('data-uri', hrf);
				
				e = $('.ems-page-product-detail .share-it a[data-type="shortLnk"]');
				if( uty.detectEl( e ) )
					new Clipboard('.share-it a[data-type="shortLnk"]', {
						text: function() {
							return hrf;
						}
					});
				
				e = $('.mod-comments');
				if( !uty.detectEl( e.find('.yorum_main') ) )	
					e.addClass( _t.cls['noComment'] );
				
				/* favoriye ekle */
				e = $('.btnFavoriEkle');
				if( uty.detectEl( e ) )
					e
					.attr('href', 'javascript:void(0);')
					.attr('onclick', 'addToFavorites.clicked(this);')
					.attr('data-prd-code', $('[id$="hdnURN_KOD"]').val());	
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.wrp ) ) ){
					_t.add();
					_t.addEvent();
				}
			}
		},
		campaing: {
			cls: { opened: 'opened', hidden: 'ems-none', focused: 'focused', noResult: 'no-result', show: 'showed' },
			el: { wrp: '.ems-page-campaigns', detailBtn: '.campaign-wrapper .btn-group .btn-product-open', content: '.campaign-wrapper', searchInput: '.ems-field.search input:eq(0)', from: '.ems-field.date input:eq(0)', to: '.ems-field.date input:eq(1)', searchBtn: '.ems-field.button button', navBtn: '.campaigns-tab .navigation-js a', slcCat: '.category select' },
			getFilter: function( o ){
				var _t = this, ID = o['ID'] || '', beginDate = ID.attr('data-start') || '', endDate = ID.attr('data-end') || '', srch = uty.trimText( $( _t.el.searchInput ).val() || '' ), from = uty.trimText( $( _t.el.from ).val() || '' ), to = uty.trimText( $( _t.el.to ).val() || '' ), k = [], b = false; 
			
				if( srch != '' )	
					k.push("ID.text().search( new RegExp( srch, 'i' ) ) != -1");
				
				if( from != '' )
					k.push("from >= beginDate");	
					
				if( to != '' )
					k.push("to >= endDate");		
				
				b = eval( k.join(' && ') );
					
				return b;	
			},
			addEvents: function(){
				var _t = this, wrp = $( _t.el.wrp ), dBtn = $( _t.el.detailBtn ), searchInput = $( _t.el.searchInput ), from = $( _t.el.from ), to = $( _t.el.to ), searchBtn = $( _t.el.searchBtn ), content = $( _t.el.content );
				
				if( uty.detectEl( dBtn ) )
					dBtn
					.bind('click', function( e ){
						e.preventDefault();
						var ths = $( this ), prt = ths.parents( _t.content ).eq( 0 ), target = prt.find('.campaign-products-wrapper');
						if( uty.detectEl( target ) ){
							if( target.hasClass( _t.cls['opened'] ) )
								target.removeClass( _t.cls['opened'] );
							else{
								target.addClass( _t.cls['opened'] );
								uty.pageScroll({ scrollTop: target.offset().top });
							}
						}
					});
				
				if( uty.detectEl( searchBtn ) )
					searchBtn
					.bind('click', function( e ){
						e.preventDefault();
						var s = uty.trimText( searchInput.val() || '' ), count = 0;
						if( s != '' ){
							wrp.addClass( _t.cls['focused'] );
							content.each(function(){
								var ths = $( this );
								if( _t.getFilter({ ID: ths, val: s, typ: 'text' }) ){	
									ths.removeClass( _t.cls['hidden'] ).addClass( _t.cls['show'] );
									count++;
								}else
									ths.addClass( _t.cls['hidden'] ).removeClass( _t.cls['show'] );
							});
							if( count == 0 )	wrp.addClass( _t.cls['noResult'] );
							else wrp.removeClass( _t.cls['noResult'] );								
						}else{
							wrp.removeClass( _t.cls['focused'] ).removeClass( _t.cls['noResult'] ); 
							content.removeClass( _t.cls['hidden'] ).removeClass( _t.cls['show'] );
						}
					});
						
			},
			getDate: function( element ) {
				var date, dateFormat = 'dd.mm.yy';
				try{ 
					date = $.datepicker.parseDate( dateFormat, element.value );
				}catch( error ){
					date = null;
				}
				return date;
			},
			initPlugins: function(){
				var _t = this, from = $( _t.el.from ), to = $( _t.el.to );
				
				if( uty.detectEl( from ) && uty.detectEl( to ) ){
					from
					.datepicker({
						changeMonth: true, 
						changeYear: true, 	
						defaultDate: '+1w',
						dateFormat: 'dd.mm.yy'
					})
					.on('change', function() {
						to.datepicker( 'option', 'minDate', _t.getDate( this ) );
					}),
					
					to
					.datepicker({
						changeMonth: true, 
						changeYear: true, 
						defaultDate: "+1w",
						dateFormat: 'dd.mm.yy'
					})
					.on( 'change', function() {
						from.datepicker( 'option', 'maxDate', _t.getDate( this ) );
					});
				}
			},
			template: {
				opt: '<option {{selected}} value="{{hrf}}">{{txt}}</option>'
			},
			getTemplate: function( o ){
				var _t = this, htm = '', typ = o['typ'] || '';
				if( typ == 'option' ){
					$( _t.el.navBtn )
					.each(function(){
						var ths = $( this ), hrf = ths.attr('href') || '', slc = ths.parent().hasClass('selected') ? 'selected' : '';
						if( hrf != '' )
							htm += _t.template.opt.replace(/{{hrf}}/g, hrf).replace(/{{txt}}/g, uty.trimText( ths.text() || '' )).replace(/{{selected}}/g, slc);
					});
				}
				return htm;
			},
			add: function(){
				var _t = this, slcCat = $( _t.el.slcCat );
				if( uty.detectEl( slcCat ) )
					slcCat
					.attr('onchange', 'window.location.href=$(this).val()')
					.html( _t.getTemplate({ typ: 'option' }) );
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el.wrp ) ) ){
					_t.add();
					_t.addEvents();
					_t.initPlugins();
				}
			}
		},
		login: {
			el: { wrp: '.ems-page-login', signupBtn: '.btn-signup-page', signinBtn: '.btn-login-page' },
			add: function(){
				var _t = this, hash = window.location.hash, k = '';
				
				if( hash == '#signin' )
					k = '.member-tab .navigation-js [rel="tab1"]';
				if( hash == '#signup' || uty.detectEl( $('.pageLogin_yeniUyelikHata') ) )
					k = '.member-tab .navigation-js [rel="tab2"]';
				
				if( uty.trimText( $('[id$="lblJavaScript"]').html() || '' ) != '' )
					k = '.member-tab .navigation-js [rel="tab2"]';
					
				k = $( k );	
				if( uty.detectEl( k ) )
					k.get( 0 ).click();
			},
			addEvent: function(){
				var _t = this, e = $('[id$="txtGuestEmail"]');
				if( uty.detectEl( e ) )
					e
					.bind('keypress', function( e ){
						var keycode = e.keyCode ? e.keyCode : e.which;
						if( keycode == '13' ){
							e.preventDefault();
							return false;
						}
					});	
				
				e = $( _t.el.signupBtn );
				if( uty.detectEl( e ) )
					e
					.bind('click', function(){
						$('.member-tab .navigation-js [rel="tab2"]').get( 0 ).click();
						uty.pageScroll({ scrollTop: 0 });
					});
					
				e = $( _t.el.signinBtn );
				if( uty.detectEl( e ) )
					e
					.bind('click', function(){
						$('.member-tab .navigation-js [rel="tab1"]').get( 0 ).click();
						uty.pageScroll({ scrollTop: 0 });
					});	
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el.wrp ) ) ){
					_t.add();
					_t.addEvent();
				}
			}
		},
		srch: {
			el: { wrp: '.ems-page-search-result', target: '.no-search-result .itext span' },
			add: function(){
				var _t = this, txt = minusLoc.get('?', 'text', urlString), target = $( _t.el.target );
				target.text( txt );
			},
			init: function(){
				var _t = this;
				if( uty.detectEl( $( _t.el.wrp ) ) )
					_t.add();
			}
		},
		cart: {
			el: { wrp: '.ems-page-cart', input: '.ems-grid-row [id$="txtURN_ADET"]' },
			cls: {},
			addEvent: function(){
				var _t = this, e = $( _t.el.input );
				if( uty.detectEl( e ) )
					e
					.each(function(){
						var ths = $( this );
							ths.attr('data-def', ( ths.val() || 1 ));
					})
					.bind('blur', function(){
						var ths = $( this ), def = ths.attr('data-def') || 1, val = ths.val() || 1;
						if( val != def )
							setTimeout(function(){
								$('.btnSepetGuncelle')
								.get( 0 )
								.click();
							}, 100);
					});	
			},
			add:function(){
				var _t = this, e = $('.ems-grid-cart .ems-grid-img .paroKampanyaAd');
				if( uty.detectEl( e ) )
					e
					.each(function(){
						var ths = $( this );
							ths.parents('.ems-grid-row').eq( 0 ).find('.plhUrunParoAciklama-clone').append( ths.clone() );	
					});
			},
			init: function(){
				var _t = this;
				if( $( _t.el.wrp ) ){
					_t.add();
					_t.addEvent();
				}
			}
		},
		init: function(){
			var _t = this;
				_t.detail.init();
				_t.main.init();
				_t.technologies.init();
				_t.campaing.init();
				_t.login.init();
				_t.srch.init();
				_t.cart.init();
		}
	},
	addToFavorites = {
		wrp: '.ems-page-product-detail, .ems-page-member-favorites',
		allow: '.ems-page-member-favorites', 
		data: null,
		uri: '/WebServices/dataService.aspx/addFavorite',
		cls: { selected: 'selected', ajx: 'ajx-fav' },
		setMessage: function( o ){
			var name = o['name'] || '', typ = o['typ'] || 'add', msg = translation['addFav'] || '{{name}} favorinize eklenmiştir.';
			if( typ == 'remove' )
				msg = translation['removeFav'] || '{{name}} favorinizden çıkartılmıştır.';
				
			msg = msg.replace(/{{name}}/g, name);
			
			if( typ == 'add' )	
				toastr.success(msg, '');
			else
				toastr.error(msg, '');
		},		
		clicked: function( k ){
			
			if( bdy.hasClass('ems-logoff') ){
				window.location.href = '/login.aspx?lang=' + lang;
				return false;
			}
				
			var _t = this, ths = $( k ), prt = ths.parents('li').eq( 0 ), obj = {}, typ = '', id = ths.attr('data-prd-code') || '', name = uty.trimText( prt.find('.ems-prd-name').text() || '' ), prc = uty.trimText( prt.find('.urunListe_satisFiyat').text() || '' ), code = uty.trimText( prt.find('.ems-urn-code').text() || '' );
			
			if( uty.detectEl( $('.ems-page-product-detail') ) ){
				name = uty.trimText( $('[id$="plhUrunAdi1"] h1').eq( 0 ).text() || '' );
				prc = uty.getPrc( $('.inner-row-2 .ems-prd-price-selling .urunDetay_satisFiyat') );
				code = uty.trimText( $('.inner-row-2 .ems-prd-code').eq( 0 ).text() || '' );
			}
			
			if( uty.detectEl( $('.page-cart') ) ){
				name = uty.trimText( ths.parents('.ems-grid-row').find('.ems-grid-name .prdItem').text() || '' );
				prc = uty.trimText( ths.parents('.ems-grid-row').find('.satBrFiyatVrg').text() || '' );
				code = uty.trimText( ths.parents('.ems-grid-row').find('.ems-grid-code').text() || '' );
			}
			
			if( id == '' ) return false;
			
			if( ths.hasClass( _t.cls['selected'] ) ){
				typ = 'remove';
				ths.add( $('[data-prd-code="'+ id +'"]') ).removeClass( _t.cls['selected'] );
				_t.set({ typ: 'remove', id: id });
			}else{
				typ = 'add';
				ths.add( $('[data-prd-code="'+ id +'"]') ).addClass( _t.cls['selected'] );
				_t.set({ typ: 'add', id: id });
			}
			
			obj['cups'] = '';
			obj['urnKod'] = id;
			obj['type'] = typ;
			obj['name'] = name;
			
			prt.addClass	( _t.cls['ajx'] );	
			pageMethod(_t.uri, decodeURIComponent( JSON.stringify( obj ) ), function success( o ){
				prt.removeClass	( _t.cls['ajx'] );	
				_t.setMessage({ name: name, typ: typ });				
			});
		},
		check: function(){
			var _t = this;
			if( _t.data != null ){
				$.each(_t.data, function( i, k ){
					if( k != 0 ){
						var e = $('[data-prd-code="'+ i +'"]');
						if( uty.detectEl( e ) )
							e.addClass( _t.cls['selected'] );
					}
				});
			}		
		},
		set: function( o ){
			var _t = this, typ = o['typ'] || '';
			if( _t.data != null ){
				if( typ == 'add' ) _t.data[ o['id'] ] = 1;
				else _t.data[ o['id'] ] = 0;
				/*http://stackoverflow.com/questions/208105/how-to-remove-a-property-from-a-javascript-object*/
				uty.Cookies({ typ: 'set', name: 'prdFav', value: JSON.stringify( _t.data ) });
			}	
		},
		ajx: function(){
			var _t = this;
			uty.ajx({ uri: '/member-fav-exp.html' }, function( d ){
				if( d['type'] == 'success' ){
					var val = d['val'];
					if( uty.cleanText( val ).length > 0 ){ 
						_t.data = JSON.parse( val );
						uty.Cookies({ typ: 'set', name: 'prdFav', value: val });
						_t.check();
					}
				}
			});	
		},
		init: function(){
			var _t = this;
			if( uty.detectEl( $( _t.wrp ) ) && bdy.hasClass('ems-login') ){		
				if( uty.detectEl( $( _t.allow ) ) ){	
					_t.ajx();
					return false;
				}
				var k = uty.Cookies({ typ: 'get', name: 'prdFav' }) || '';
				if( k != '' ){ 
					_t.data = JSON.parse( k );
					_t.check();
				}else
					_t.ajx();
			}
		}
	},
	resetDom = {
		k: true,
		onResize: function(){
			var _t = this;
			if( !_t.k && uty.visibleControl() ){
				// mobi
				_t.k = true;
				uty.setCls({ ID: '.urunDetay .thumb-pager .swiper-inner', typ: 'remove', cls: 'swiper-container-vertical' });
			}else if( _t.k && !uty.visibleControl() ){
				// pc
				_t.k = false;
				uty.setCls({ ID: '.urunDetay .thumb-pager .swiper-inner', typ: 'add', cls: 'swiper-container-vertical' });
			}
		},
		init: function(){
			var _t = this;
			if( uty.visibleControl() )
				_t.k = false;
		}
	},
	events = {
		bdyClicked: function(){
			$('body, html').bind('click touchstart', function( e ){
				var m = $('.dropdown, .member-menu'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('opened');
				
				m = $('.kutuSolMenuTree'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('opened');	
				
				m = $('.ems-custom-dropdown'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('open');
					
				m = $('.mod-mini-search'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					modules.customSearch.destroy();	
				
				var m = $('.step-form-wrapper .categories'); 
				if( !m.is( e.target ) && m.has( e.target ).length === 0 )
					m.removeClass('opened');	
						
			});	
		},
		loaded: function(){
			uty.lazyLoad( { ID: 'body' } );
		},
		ready: function(){
			api.init();
			pages.detail.ready();
		},
		onResizeStop: function(){
			plugin.slider.adjust();
		},
		onResize: function(){
			wt = parseFloat( win.width() );
			ht = parseFloat( win.height() );
			
			modules.adjust();
			resetDom.onResize();
		},
		onScroll: function(){
			wst = parseFloat( win.scrollTop() );
			sRatio = wst / ( doc.height() - ht );
			
			modules.onScroll();
		},
		init: function(){
			var _t = this;
				_t.bdyClicked();
			win.load( _t.loaded );
			win.bind('resizestop', _t.onResizeStop);
			win.resize( _t.onResize ).resize();
			win.scroll( _t.onScroll ).scroll();
			doc.ready( _t.ready );	
		}
	},
	initialize = function(){
		plugin.init();
		management.init();
		modules.init();
		pages.init();
		addToFavorites.init();
		resetDom.init();
		events.init();
	};
	
	initialize();
	
/****** DISPATCH ******/

/* CART */	
stage.addEventListener("CustomEvent", [ { type: "sepetDoldur", handler: "cartAmound" } ]);
stage.addEventListener("CustomEvent", [ { type: "sepeteEkle", handler: "cartAdd" } ]);	
function cartAmound(){ modules.cart.amound(); }
function cartAdd(){ modules.cart.add(); }
cartAmound();

/* LOGIN */
stage.addEventListener("CustomEvent", [ { type: "uyeLogin", handler: "onUyeLogin" } ]);
function onUyeLogin(){ modules.login.set(); }
onUyeLogin();

/* COMPARE */
stage.addEventListener("CustomEvent", [ { type: "kiyaslaUrunEkle", handler: "onComparePrdAdd" } ]);
function onComparePrdAdd(){	modules.compare.add(); }

/* CREDI CART */
stage.addEventListener("CustomEvent", [ { type: "taksitChanged", handler: "onTaksitChanged" } ]);
function onTaksitChanged(){ modules.crediCart.addBankLogo(); }

/* */
stage.addEventListener("CustomEvent", [ { type: "aramaSonucDoldur", handler: "onAramaSonucDoldur" } ]);
function onAramaSonucDoldur(){
	var e = $('.searchSuggestDivHolder');
	setTimeout(function(){
		if( !uty.detectEl( e.find('.ems-list-holder .ems-prd-list') ) ){
			management.append.init([{ main: '.ems-list-holder > div', target: '.searchSuggestDivHolder', add: 'prepend', clone: true }]);
			if( uty.detectEl( $('img.lazy-load', e) ) )
				$('img.lazy-load', e).unveil().trigger('unveil');
		}
		
		if( uty.detectEl( $('td', e) ) )
			bdy.addClass('search-result-found').removeClass('search-no-result');
		else	
			bdy.removeClass('search-result-found').addClass('search-no-result');
			
	}, 100);
}

/*EMS0004293231650 iceriklerde rate*/
stage.addEventListener("CustomEventClass", [{type:"CUSTOM_RATE_CONTENT", handler:"onCustomRateContent"}]);
function onCustomRateContent( o ){
    var ID = o['ID'], typ = o['type'], prt = ID.parents('.rate-content').eq( 0 );
	prt.addClass('ems-submitted');
	if( ID.hasClass('rate-btn-yes') )
		prt.addClass('ems-submit-yes');
	else
		prt.addClass('ems-submit-no');
}

/* ÜYE BİLGİ ADRES SİLME */
function removeAddr( code ){
	var e = $('.member-info-address [rel="'+ code +'"]');
	pageMethod('/pageMethods.aspx/uyeAdresSil', '{"kodlar":"' + code + '" }', function success( o ){
		if( o.d == 1 )
			e.fadeOut(222, 'swing', function(){
				setTimeout(function(){ e.remove(); }, 10);
			});
	});
}
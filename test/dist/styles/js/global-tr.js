/* HER ÜLKE İÇİN OLUŞTURULMALI, ZORUNLULUKLAR ÜLKE BAZLI DEĞİŞEBİLİR */
var utlty = {
		detectEl: function( ID ){ return ID.length > 0 ? true : false; }
	},
	formManagement = {
	/* regex kullanılınca özel karekterler çalışmayacak */
	regex: {
		typ1: /[^a-zA-ZıiIğüşöçİĞÜŞÖÇ\s]+/g, /* sadece harf */
		typ2: /[^0-9\s]+/g, /* sadece rakam */
		typ3: /[^a-zA-ZıiI0-9ğüşöçİĞÜŞÖÇ\s]+/g /* harf rakam karışık */
	},	
	arr: [				
		{ 'el': '[id$="txtHCK_KEY"]', 'placeHolder': $('[id$="lbfHCK_KEY"]').text() || 'Kupon No' },
		{ 'el': '[id$="txtUYA_CEPTELEFON"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtUYM_TELEFON"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '.telefon', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="lbfUYE_KONTROLKODU"]', 'class': 'zorunluFont' },
		{ 'el': '.ems-page-member-login [id$="lbfUYE_CEPTELEFON"]', 'class': 'zorunluFont' },
		{ 'el': '.ems-page-new-address [id$="lbfUYA_TCKIMLIKNO"]', 'class': 'zorunluFont' },
		{ 'el': '[id$="txtUYA_TELEFON"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '.ems-page-member-login [id$="drpUYE_CINSIYET"]', 'val': 1 },
		{ 'el': '[id$="txtUYE_EMAIL"]', 'prop': { 'refalertid': 'refLbfUYE_EMAIL' } },
		{ 'el': '[id$="txtUYE_SIFRE"]', 'prop': { 'refalertid': 'refLbfUYE_SIFRE' } },
		{ 'el': '[id$="txtprm_evtel"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtprm_istel"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtprm_ceptel"]', 'mask': '09999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtPRM_EMAIL"]', 'prop': { 'attribute': 'mail' } },
		{ 'el': '[id$="txtUYA_TCKIMLIKNO"]', 'mask': '99999999999', 'required': 'required', 'prop': { 'type': 'tel' }  },
		{ 'el': '[id$="txtUYE_CEPTELEFONALAN"]', 'mask': '999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtUYE_CEPTELEFON"]', 'mask': '9999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtParoCellPhone"]', 'mask': '9999999999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtParoValidationCode"]', 'mask': '99999', 'prop': { 'type': 'tel' } },
		{ 'el': '[id$="txtFAFirmaAd"]', 'attr': { 'maxlength': '40' } },
		{ 'el': '[id$="txtFAUYA_VERGIDAIRESI"]', 'required': 'required', 'attr': { 'maxlength': '20' } },
		{ 'el': '[id$="txtFAVergiNo"]', 'mask': '9999999999', 'prop': { 'type': 'tel' } }
	],
	set: function( o ){
		var _t = this, el = $( o['el'] );
		if( utlty.detectEl( el ) ){
			var msk = o['mask'] || '', plc = o['placeHolder'] || '', rqrd = o['required'] || '', cls = o['class'] || '', rgx = o['regex'] || '', prop = o['prop'] || '', attr = o['attr'] || '', val = o['val'] || '';
			
			if( val != '' )
				el.val( val );
			
			if( prop != '' )
				$.each(prop, function( i, k ){
					el.prop( i, k );
				});
			
			if( attr != '' )
				$.each(attr, function( i, k ){
					el.attr( i, k );
				});
			
			if( msk != '' ){
				el.removeAttr('maxlength');
				el.mask(msk, { autoclear: true });
			}
			if( plc != '' ) 
				el.attr('placeholder', plc );
			
			if( rqrd != '' )	
				el.attr('required', rqrd );	
				
			if( cls != '' )	
				el.addClass( cls );
			
			if( rgx != '' )
				el
				.attr('data-regex', rgx)
				.unbind('keyup paste', _t.events.onKeyUp)
				.bind('keyup paste', _t.events.onKeyUp);
		}
	},
	events: {
		onKeyUp: function(){
				var _t = formManagement, ths = $( this ), val = ths.val(), rgx = ths.attr('data-regex') || '';
				rgx = _t.regex[ rgx ] || '';
				if( rgx != '' )
					ths.val( val.replace( rgx, '') );
		}
	},
	init: function(){
		var _t = this, arr = _t.arr;
		for( var i = 0; i < arr.length; ++i )
			_t.set( arr[ i ] );	
	}
};

formManagement.init();


$(document).ready(function(){
    setTimeout(function(){
		var e = $('[id$="txtUYE_DOGUMTARIHI"], [id$="txtprm_dogumtarih"]');
		if( utlty.detectEl( e ) )
			e.datepicker( "option", "maxDate", 0 );
	}, 100);
});
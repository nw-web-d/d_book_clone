function openTTCrochet(BREF,WIDTH,HEIGHT,STARTPAGE){
	if( STARTPAGE == null ){
		STARTPAGE = 0;
	}
	document.write('<OBJECT classid="CLSID:2B658B62-1B6F-4CFF-8A7C-225B7BB15336" width="');
	document.write(WIDTH);
	document.write('" height="');
	document.write(HEIGHT);
	document.write('" codebase="http://www.dotbook.jp/crochet/download/T-TimeCrochet.cab#version=1,1,0,0">\n');
	document.write('<PARAM name="src" value="');
	document.write(BREF);
	document.write('">\n');
	document.write('<PARAM name="start" value="');
	document.write(STARTPAGE);
	document.write('">\n');
	document.write('<EMBED src="');
	document.write(BREF);
	document.write('" type="application/x-crochetTime" width="');
	document.write(WIDTH);
	document.write('" height="');
	document.write(HEIGHT);
	document.write('" pluginspage="http://www.dotbook.jp/crochet/download/"');
	document.write(' start="');
	document.write(STARTPAGE);
	document.write('"></EMBED>\n');
	document.write('</OBJECT>\n');
}


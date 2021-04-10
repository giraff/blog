// 에디터에서 보여지는 부분을 설정을 통해 추가해나갈 수 있다.

import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";

import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";

import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";

import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";

import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";

import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";

import Code from "@ckeditor/ckeditor5-basic-styles/src/code";

import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";

import Link from "@ckeditor/ckeditor5-link/src/link";

import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";

import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";

import Heading from "@ckeditor/ckeditor5-heading/src/heading";

import Font from "@ckeditor/ckeditor5-font/src/font";

import Image from "@ckeditor/ckeditor5-image/src/image";

import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";

import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";

import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";

import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";

import List from "@ckeditor/ckeditor5-list/src/list";

import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";

import Table from "@ckeditor/ckeditor5-table/src/table";

import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";

import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";

import Indent from "@ckeditor/ckeditor5-indent/src/indent";

import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";

/* import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter"; */

import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter";

 

import "@ckeditor/ckeditor5-build-classic/build/translations/ko";

import dotenv from "dotenv";

 

dotenv.config();

 

export const editorConfiguration = {

plugins: [

Essentials,

Paragraph,

Bold,

Code,

Italic,

Heading,

Indent,

IndentBlock,

Underline,

Strikethrough,

BlockQuote,

Font,

Alignment,

List,

Link,

MediaEmbed,

PasteFromOffice,

Image,

ImageStyle,

ImageToolbar,

ImageUpload,

ImageResize,

SimpleUploadAdapter,

Table,

TableToolbar,

TextTransformation,

],
// 플러그인에서 불러온 것들을
// toolbar에서 하나하나 직접 넣어주는 것

// 보여지는 순서는 여기 toolbar에서 수정하면 됨.

toolbar: [

"heading",

"|",

"bold",

"italic",

"underline",

"strikethrough",

"code",

"|",

"fontSize",

"fontColor",

"fontBackgroundColor",

"|",

"alignment",

"outdent",

"indent",

"bulletedList",

"numberedList",

"blockQuote",

"|",

"link",

"insertTable",

"imageUpload",

"mediaEmbed",

"|",

"undo",

"redo",

],

heading: {

options: [

{

model: "paragraph",

view: "p",

title: "본문",

class: "ck-heading_paragraph",

},

{

model: "heading1",

view: "h1",

title: "헤더1",

class: "ck-heading_heading1",

},

{

model: "heading2",

view: "h2",

title: "헤더2",

class: "ck-heading_heading2",

},

{

model: "heading3",

view: "h3",

title: "헤더3",

class: "ck-heading_heading3",

},

],

},

fontSize: {

options: [

9,

10,

11,

12,

13,

14,

15,

16,

17,

18,

19,

20,

21,

23,

25,

27,

29,

31,

33,

35,

],

},

alignment: {

options: ["justify", "left", "center", "right"],

},

table: {

contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],

},

image: {

resizeUnit: "px",

toolbar: [

"imageStyle:alignLeft",

"imageStyle:full",

"imageStyle:alignRight",

"|",

"imageTextAlternative",

],

styles: ["full", "alignLeft", "alignRight"],

},

typing: {

transformations: {

remove: [

"enDash",

"emDash",

"oneHalf",

"oneThird",

"twoThirds",

"oneForth",

"threeQuarters",

],

},

},

language: "ko",
// 가장 중요한 부분 !! 이미지 업로드 부분.. 사진을 클릭 혹은 드래그를 해서 사진을 넣을 수 있다.
// 사진이 그냥 넣어지는 게 아닌, deploy 할 생각이 있다면 AWS S3 저장소를 활용하게 될 것이며
// 그림을 넣자마자 AWS S3에 저장이 되고, 저장된 후 그 파일이 저장되어있는 주소를 반환 받아 CKEditor 상에 보여지는 것
// 위의 설정들은 그냥 붙여넣기 하면 되지만, simpleUpload 는 매우 중요하다.
// CKEditor은 기본적으로 무료이지만, '동시 사용자 25명'
simpleUpload: {
//  개발 서버이므로, 서버 주소 (7000)를 .env 변수값을 이용해 작성
uploadUrl: `${process.env.REACT_APP_BASIC_SERVER_URL}/api/post/image`,

 

// Headers sent along with the XMLHttpRequest to the upload server.

headers: {

"X-CSRF-TOKEN": "CSFR-Token",



},

},

};

 

export const ReadOnly_Configuration = {

toolbar: ["heading"],

heading: {},

};

 


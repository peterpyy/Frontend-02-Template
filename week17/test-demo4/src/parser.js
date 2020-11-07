let stack;
let currentToken = null;
let currentAttribute = null;
let currentTextNode = null;

function emit(token){
    let top = stack[stack.length-1];
    if(token.type== "startTag"){
        let element = {
            type:'element',
            children:[],
            attributes:[]
        };

        element.tagName = token.tagName;

        for(let p in token){
            if(p != 'type' && p != 'tagName'){
                element.attributes.push({
                    name:p,
                    value:token[p]
                });
            }
        }
        top.children.push(element);
        element.parent=top;

        if(!token.isSelfClosing){
            stack.push(element);
        }

        currentTextNode = null;
    }else if(token.type == 'endTag'){
        if(top.tagName != token.tagName){
            throw new Error("Tag start and doesn't match!");
        }else{
            stack.pop();
        }
        currentTextNode = null;
    }else if(token.type == 'text'){
        if(currentTextNode == null){
            currentTextNode = {
                tpye:'text',
                content:''
            }
            top.children.push(currentTextNode);
        }
        currentTextNode.content += token.content;
    }
}

const EOF = Symbol("EOF");

//核对
function data(c){
    if(c === '<'){
        return tagOpen;
    }else if(c === EOF){
        emit({
            type:"EOF"
        });
        return;
    }else{
        emit({
            type:"text",
            content:c
        });
        return data;
    }
}
//核对
function tagOpen(c){
    if(c === '/'){
        return endTagOpen;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"startTag",
            tagName:""
        }
        return tagName(c);
    }else{
        return;
    }
}
//核对
function endTagOpen(c){
    if(c.match(/^[a-zA-Z]$/)){
        currentToken = {
            type:"endTag",
            tagName:""
        }
        return tagName(c);
    }else if(c === ">"){
        
    }else if(c === EOF){

    }else{

    }
}

//核对
function tagName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c === '/'){
        return selfClosingStartTag;
    }else if(c.match(/^[a-zA-Z]$/)){
        currentToken.tagName += c;
        return tagName;
    }else if(c === ">"){
        emit(currentToken);
        return data;
    }else {
        currentToken.tagName += c;
        return tagName;
    }
}
//核对
function beforeAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if(c == '='){
        //return beforeAttributeName;
    }else{
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}
//核对
function afterAttributeName(c){
    if(c.match(/^[\t\n\f ]$/)){
        return afterAttributeName;
    }else if(c == "/"){
        return selfClosingStartTag;
    }else if(c == '='){
        return beforeAttributeValue;
    }else if(c ==">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c==EOF){

    }else{
        currentToken[currentAttribute.name] = currentAttribute.value;
        currentAttribute = {
            name:"",
            value:""
        }
        return attributeName(c);
    }
}
//核对
function attributeName(c){
    if(c.match(/^[\t\n\f ]$/) || c == "/" || c == ">" || c == EOF){
        return afterAttributeName(c);
    }else if(c == "="){
        return beforeAttributeValue;
    }else if(c == "\u0000"){

    }else if(c == "\"" || c =="'" || c == "<"){

    }else{
        currentAttribute.name += c;
        return attributeName;
    }
}
//核对
function beforeAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/) || c=="/" || c==">" || c==EOF){
        return beforeAttributeValue;
    }else if(c=="\""){
        return doubleQuotedAttributeValue;
    }else if(c=="\'"){
        return singleQuotedAttributeValue;
    }else if(c == ">"){

    }else{
        return UnquotedAttributeValue(c);
    }
}

function doubleQuotedAttributeValue(c){
    if(c == "\""){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttrbuteValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function singleQuotedAttributeValue(c){
    if(c == "\'"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return afterQuotedAttrbuteValue;
    }else if(c == "\u0000"){

    }else if(c == EOF){

    }else {
        currentAttribute.value += c;
        return doubleQuotedAttributeValue;
    }
}

function afterQuotedAttrbuteValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        return beforeAttributeName;
    }else if(c =="/"){
        return selfClosingStartTag;
    }else if(c == ">"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        emit(currentToken);
        return data;
    }else if(c == EOF){

    }else {
        throw new Error("unexpected character:\"" + c +"\"")
        //currentAttribute.value += c;
        //return doubleQuotedAttributeValue;
    }
}

function UnquotedAttributeValue(c){
    if(c.match(/^[\t\n\f ]$/)){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return beforeAttributeName;
    }else if(c == "/"){
        currentToken[currentAttribute.name] = currentAttribute.value;
        return selfClosingStartTag;
    }else if(c == "\u0000"){

    }else if(c =="\"" || c=="'" || c=="<" || c=="=" || c=="`"){

    }else if(c==EOF){

    }else{
        currentAttribute.value += c;
        return UnquotedAttributeValue;
    }
}

function selfClosingStartTag(c){
    if(c == ">"){
        currentToken.isSelfClosing = true;
        return data;
    }else if(c == "EOF"){

    }else{
        
    }
}

export function parseHTML(html){
    stack = [{type:'document',children:[]}];
    currentToken = null;
    currentAttribute = null;
    currentTextNode = null;
    let state = data;
    for(let c of html){
        state = state(c);
    }
    state = state(EOF);
    //console.log(stack[0]);
    return stack[0];
}
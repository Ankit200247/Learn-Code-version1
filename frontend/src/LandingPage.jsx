import React, { useEffect, useRef } from "react";
import "./LandingPage.css";

const landingMarkup = `
<svg aria-hidden="true" height="0" style="position:absolute" width="0">
<symbol id="code" viewbox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></symbol>
<symbol id="screen" viewbox="0 0 24 24"><rect height="13" rx="2" width="18" x="3" y="4"></rect><path d="M8 21h8M12 17v4"></path></symbol>
<symbol id="ai" viewbox="0 0 24 24"><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"></path></symbol>
<symbol id="layers" viewbox="0 0 24 24"><path d="M12 3l9 5-9 5-9-5z"></path><path d="M3 13l9 5 9-5"></path></symbol>
<symbol id="bars" viewbox="0 0 24 24"><path d="M5 20V11M12 20V4M19 20v-6"></path></symbol>
<symbol id="job" viewbox="0 0 24 24"><rect height="13" rx="2" width="18" x="3" y="7"></rect><path d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"></path></symbol>
<symbol id="tree" viewbox="0 0 24 24"><circle cx="12" cy="5" r="2"></circle><circle cx="5" cy="19" r="2"></circle><circle cx="19" cy="19" r="2"></circle><path d="M12 7v4M12 11l-6 6M12 11l6 6"></path></symbol>
<symbol id="check" viewbox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M8 12l3 3 5-6"></path></symbol>
</svg>
<header class="nav">
<div class="wrap">
<a class="logo" href="#"><span class="mark"><svg class="i"><use href="#code"></use></svg></span>Learn Code</a>
<nav class="links">
<a href="#features">What you get</a>
<a href="#mentor">AI Mentor</a>
<a href="#about">About</a>
<a href="https://learn-code-frontend-xu8j.onrender.com/">Log in</a>
<a class="btn sm" href="https://learn-code-frontend-xu8j.onrender.com/">Get started</a>
</nav>
</div>
</header>
<main>
<div class="stage"><div class="wrap hero">
<div>
<span class="badge">One platform to crack placements</span>
<h1>Learn how to code. <em>Grow your skills.</em></h1>
<p>Learn programming, practise coding and ask your AI Mentor for help whenever you are stuck. Start as a beginner and build skills for your future.</p>
<div class="row">
<a class="btn" href="https://learn-code-frontend-xu8j.onrender.com/">Start as a beginner</a>
</div>
</div>
<div aria-label="Example Java program and its output" class="win">
<div class="top"><i></i><i></i><i></i><span>Welcome.java</span><button class="run" id="run" type="button">▶ Run</button></div>
<pre><span class="k">public class</span> Welcome {
    <span class="k">public static void</span> main(String[] args) {
        System.out.println(<span class="s">"WELCOME TITS"</span>);
    }
}</pre>
<div class="tests">
<div><svg class="i"><use href="#check"></use></svg>Output: WELCOME TITS</div>
</div>
<span class="chip c1">&lt;/&gt;</span>
<span class="chip c2">{ }</span>
<span class="chip c3">int x</span>
</div>
</div></div>
<section id="features">
<div class="wrap">
<div class="head"><h2>Everything you need to prepare</h2></div>
<div class="grid3">
<div class="card"><span class="ic"><svg class="i"><use href="#code"></use></svg></span><h3>Programming lessons</h3><p>Begin with the basics. Each topic builds on the one before it.</p></div>
<div class="card"><span class="ic p"><svg class="i"><use href="#screen"></use></svg></span><h3>Coding and DSA practice</h3><p>Write code, run it against test cases and work through arrays, trees and graphs.</p></div>
<div class="card"><span class="ic o"><svg class="i"><use href="#layers"></use></svg></span><h3>Subjects</h3><p>DBMS, Operating Systems, Computer Networks and OOP concepts.</p></div>
<div class="card"><span class="ic"><svg class="i"><use href="#bars"></use></svg></span><h3>Aptitude and reasoning</h3><p>Sharpen the skills that company screening tests look for.</p></div>
</div>
</div>
</section>
<section class="white mentor" id="mentor">
<div class="wrap">
<div>
<h2>Get unstuck with your AI Mentor</h2>
<p class="lead">Ask a question any time and get an answer that helps you understand, not just copy.</p>
<ul class="ticks">
<li><svg class="i"><use href="#check"></use></svg><div><b>Hints before answers</b><span>Nudges that let you find the fix yourself.</span></div></li>
<li><svg class="i"><use href="#check"></use></svg><div><b>Plain-language explanations</b><span>Concepts explained without jargon.</span></div></li>
<li><svg class="i"><use href="#check"></use></svg><div><b>Mistake review</b><span>See exactly where your code went wrong.</span></div></li>
</ul>
</div>
<div class="chat" id="chat">
<div class="who"><span class="ic p"><svg class="i"><use href="#ai"></use></svg></span>AI Mentor</div>
<div class="msg me">Why does my loop never stop?</div>
<div class="msg ai">Look at your condition. The value of i never changes inside the loop. What should happen to it on each pass?</div>
<div class="msg me">Oh, I forgot i++!</div>
<div class="msg ai">Exactly. Run it again and check the output.</div>
<div class="ask" hidden="" id="ask"></div>
<form autocomplete="off" class="sform" id="sform"><input aria-label="Ask the AI Mentor" id="sq" placeholder="Ask anything about coding..." type="text"/><button class="btn sm" type="submit">Ask</button></form>
<div class="left" id="left"></div>
</div>
</div>
</section>
<section id="explain">
<div class="wrap">
<div class="head"><h2>Understand every line of code</h2><p>The AI Mentor walks through your code one line at a time, in the language you are most comfortable with.</p></div>
<div class="xp">
<div class="xbar"><span>Welcome.java</span>
<div aria-label="Explanation language" class="seg" id="seg" role="group"><button aria-pressed="true" data-l="en" type="button">English</button><button aria-pressed="false" data-l="hi" type="button">हिन्दी</button></div>
</div>
<div class="xbody">
<div class="xcode" id="xcode" role="list"></div>
<div aria-live="polite" class="xnote"><div class="xl" id="xl"></div><p id="xt"></p><div class="xout" id="xo"></div></div>
</div>
</div>
</div>
</section>
<div class="cta">
<div class="wrap">
<div class="box">
<h2>Take the first step towards your goal</h2>
<p>Open Learn Code and begin with a topic you have been putting off.</p>
<a class="btn" href="https://learn-code-frontend-xu8j.onrender.com/">Create your account</a>
</div>
</div>
</div>
</main>
<footer class="ft">
<div class="wrap">
<div class="fgrid">
<div class="fbrand" id="about">
<a class="logo" href="#"><span class="mark"><svg class="i"><use href="#code"></use></svg></span>Learn Code</a>
<p>This website is developed by Students of Technocrats Institute of Technology and Science, Bhopal, MP.</p>
<p>Learn Code is a Student-built learning platform for anyone starting their programming journey. It brings lessons, coding practice, core subjects and an AI Mentor together, so you can prepare for placements without jumping between websites.</p>
<p>Start as a beginner, practise at your own pace and build skills for your future.</p>
</div>
<div><h4>Explore</h4><a href="#features">What you get</a><a href="#mentor">AI Mentor</a></div>
<div><h4>Get started</h4><a href="https://learn-code-frontend-xu8j.onrender.com/">Log in or sign up</a></div>
</div>
<div class="fbot"><span>© 2026 Learn Code. All rights reserved.</span></div>
</div>
</footer>

`;
const landingScript = `
(function(){
  var msgs=document.querySelectorAll('#chat .msg');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce||!('IntersectionObserver' in window))return;
  document.documentElement.classList.add('js');
  var played=false;
  new IntersectionObserver(function(es,o){
    if(es[0].isIntersecting&&!played){
      played=true;o.disconnect();
      msgs.forEach(function(m,i){setTimeout(function(){m.classList.add('show')},i*900)});
    }
  },{threshold:.4}).observe(document.getElementById('chat'));
})();
(function(){
  var win=document.querySelector('.win'),hero=document.querySelector('.hero');
  if(!win||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var rest='perspective(1000px) rotateX(4deg) rotateY(-8deg)';
  win.style.transform=rest;
  hero.addEventListener('mousemove',function(e){
    var r=hero.getBoundingClientRect();
    var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    win.style.transform='perspective(1000px) rotateX('+(4-y*10)+'deg) rotateY('+(-8+x*14)+'deg)';
  });
  hero.addEventListener('mouseleave',function(){win.style.transform=rest});
})();
(function(){
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var nav=document.querySelector('.nav');
  addEventListener('scroll',function(){nav.classList.toggle('sc',scrollY>8)},{passive:true});
  if(reduce)return;
  var win=document.querySelector('.win'),run=document.getElementById('run');
  function play(ms){win.classList.add('pending');setTimeout(function(){win.classList.remove('pending')},ms)}
  play(1400);
  run.addEventListener('click',function(){play(700)});
  var cards=document.querySelectorAll('#features .card');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){var i=[].indexOf.call(cards,e.target);setTimeout(function(){e.target.classList.add('in')},(i%2)*120);io.unobserve(e.target)}
    })},{threshold:.2});
    cards.forEach(function(c){c.classList.add('rv');io.observe(c)});
  }
  if(window.matchMedia('(hover:hover)').matches){
    cards.forEach(function(c){
      c.addEventListener('mousemove',function(e){
        var r=c.getBoundingClientRect();
        var x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
        c.style.transform='perspective(700px) rotateX('+(-y*7)+'deg) rotateY('+(x*9)+'deg) translateY(-2px)';
      });
      c.addEventListener('mouseleave',function(){c.style.transform=''});
    });
  }
})();
(function(){
  var SITE='https://learn-code-frontend-xu8j.onrender.com/';
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n}
  var chat=document.getElementById('chat'),ask=document.getElementById('ask');
  var QA=[
    ['What is a primary key?','A primary key is a column that uniquely identifies every row in a table. It cannot repeat and cannot be empty.'],
    ['Stack or queue: what is the difference?','A stack removes the newest item first (last in, first out). A queue removes the oldest item first (first in, first out).'],
    ['Why do I get a NullPointerException?','Your code is using an object that has no value yet. Find which variable is null on that line, then check where it should have been created.']
  ];
  function add(c,t){var m=el('div',c,t);chat.insertBefore(m,ask);requestAnimationFrame(function(){m.classList.add('show')})}
  QA.forEach(function(p){
    var b=el('button','',p[0]);b.type='button';
    b.onclick=function(){add('msg me',p[0]);setTimeout(function(){add('msg ai',p[1])},600)};
    ask.appendChild(b);
  });
})();
(function(){
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n}
  var C=[
    \`<span class="k">public class</span> Welcome {\`,
    \`  <span class="k">public static void</span> main(String[] args) {\`,
    \`    <span class="k">int</span> total = 0;\`,
    \`    <span class="k">for</span> (<span class="k">int</span> i = 1; i &lt;= 5; i++) {\`,
    \`      total += i;\`,
    \`    }\`,
    \`    System.out.println(total);\`,
    \`  }\`,
    \`}\`
  ];
  var E={
    en:[
      'Declares a class named Welcome. In Java, every program lives inside a class.',
      'The main method is the entry point. The program starts running from here.',
      'Creates an integer variable called total and sets it to 0. It will hold the running sum.',
      'Starts a loop. The counter i begins at 1 and the loop repeats while i is 5 or less, increasing i by 1 each time.',
      'Adds the current value of i to total. When the loop ends, total holds 1 + 2 + 3 + 4 + 5.',
      'Closes the body of the loop.',
      'Prints the final value of total to the console. The result is 15.',
      'Closes the main method.',
      'Closes the class.'
    ],
    hi:[
      'Welcome नाम की एक क्लास घोषित की गई है। Java में हर प्रोग्राम किसी क्लास के अंदर ही लिखा जाता है।',
      'main मेथड प्रोग्राम का प्रवेश बिंदु है। प्रोग्राम का निष्पादन यहीं से शुरू होता है।',
      'total नाम का एक पूर्णांक (integer) वेरिएबल बनाया गया है और उसका प्रारंभिक मान 0 रखा गया है। इसमें जोड़ का परिणाम जमा होगा।',
      'यहाँ से लूप शुरू होता है। काउंटर i का मान 1 से शुरू होता है और जब तक i, 5 के बराबर या उससे कम है, लूप दोहराया जाता है। हर बार i में 1 की वृद्धि होती है।',
      'i के वर्तमान मान को total में जोड़ा जाता है। लूप समाप्त होने पर total में 1 + 2 + 3 + 4 + 5 का योग होगा।',
      'लूप का ब्लॉक यहाँ समाप्त होता है।',
      'total का अंतिम मान कंसोल पर प्रिंट किया जाता है। परिणाम 15 है।',
      'main मेथड यहाँ समाप्त होता है।',
      'क्लास यहाँ समाप्त होती है।'
    ]
  };
  var LB={en:'Line',hi:'पंक्ति'},OUT={en:'Output: 15',hi:'आउटपुट: 15'};
  var box=document.getElementById('xcode'),xl=document.getElementById('xl'),xt=document.getElementById('xt'),xo=document.getElementById('xo');
  var cur=0,lang='en',timer=null,btns=[];
  C.forEach(function(h,i){
    var b=el('button','ln');b.type='button';b.setAttribute('role','listitem');
    b.appendChild(el('span','no',String(i+1)));
    var tx=el('span','tx');tx.innerHTML=h;b.appendChild(tx);
    b.addEventListener('click',function(){stop();cur=i;render()});
    box.appendChild(b);btns.push(b);
  });
  function render(){
    btns.forEach(function(b,i){b.classList.toggle('on',i===cur)});
    xl.textContent=LB[lang]+' '+(cur+1);
    xt.textContent=E[lang][cur];
    xo.textContent=cur===6?OUT[lang]:'';
  }
  function stop(){if(timer){clearInterval(timer);timer=null}}
  document.querySelectorAll('#seg button').forEach(function(b){
    b.addEventListener('click',function(){
      stop();lang=b.dataset.l;
      document.querySelectorAll('#seg button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      render();
    });
  });
  render();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){
      if(es[0].isIntersecting){
        io.disconnect();
        timer=setInterval(function(){cur=(cur+1)%C.length;render()},3200);
      }
    },{threshold:.5});
    io.observe(document.querySelector('.xp'));
  }
})();
(function(){
  function el(t,c,x){var n=document.createElement(t);if(c)n.className=c;if(x)n.textContent=x;return n}
  var SITE='https://learn-code-frontend-xu8j.onrender.com/';
  var chat=document.getElementById('chat'),ask=document.getElementById('ask'),form=document.getElementById('sform'),inp=document.getElementById('sq'),left=document.getElementById('left');
  if(!chat||!form)return;
  var MAX=4,used=0,locked=false;
  var KB=[
    [['javascript'],'JavaScript is the language of the web. It runs in the browser to make pages interactive, and with Node.js it can also run on servers.'],
    [['java'],'Java is a popular object-oriented language used for Android apps, backend systems and placement coding rounds. A good way to start is with classes, loops and arrays.'],
    [['python'],'Python is a beginner-friendly language with simple, readable syntax. It is widely used for scripting, data science and problem solving.'],
    [['c++','cpp'],'C++ is a fast, general-purpose language that supports object-oriented programming. It is very popular for DSA and competitive coding.'],
    [['html'],'HTML is the markup language that defines the structure of a web page, such as headings, paragraphs, links and images.'],
    [['css'],'CSS controls how a web page looks, including colours, fonts, spacing and layout.'],
    [['dsa','data structure','algorithm'],'DSA stands for Data Structures and Algorithms. Data structures organise data, and algorithms are the steps used to solve problems with it. Interviewers use them to test problem solving.'],
    [['primary key'],'A primary key is a column, or a set of columns, that uniquely identifies each row in a table. Its values cannot repeat and cannot be empty.'],
    [['foreign key'],'A foreign key is a column that refers to the primary key of another table. It links the two tables together.'],
    [['join','sql'],'A JOIN combines rows from two tables using a related column, for example matching orders to customers. SQL is the language used to write such queries.'],
    [['stack','queue'],'A stack removes the newest item first (last in, first out). A queue removes the oldest item first (first in, first out).'],
    [['null'],'A NullPointerException means your code is using an object that has no value yet. Find which variable is null on that line, then check where it should have been created.'],
    [['loop','infinite'],'Check the loop condition and make sure the counter changes on every pass. A missing i++ is a common cause of an infinite loop.'],
    [['linked list'],'A linked list stores items as nodes, and each node points to the next one. Inserting is easy, but searching is slower than in an array.'],
    [['array'],'An array stores several values of the same type in an indexed sequence. Indexing starts at 0.'],
    [['recursion'],'Recursion is when a function calls itself on a smaller version of the problem. It needs a base case so that it knows when to stop.'],
    [['deadlock'],'A deadlock happens when two or more processes each wait for a resource held by another, so none of them can continue.'],
    [['normalization','normalisation'],'Normalization organises a database to reduce repeated data and avoid update problems.'],
    [['dbms','database'],'A DBMS (Database Management System) stores, retrieves and manages data. MySQL and PostgreSQL are common examples.'],
    [['inheritance','oop','polymorphism','encapsulation'],'OOP organises code into objects. Its four pillars are encapsulation, inheritance, polymorphism and abstraction.'],
    [['operating system','scheduling','process'],'An operating system manages hardware and software resources, and lets programs share the CPU, memory and storage.'],
    [['network','tcp','http'],'Computer Networks describe how devices communicate. TCP delivers data reliably and in order, while UDP is faster but does not guarantee delivery.']
  ];
  var FALL='I can explain this better with a little more detail. Try asking about a topic such as Java, loops, arrays, SQL, OOP or deadlock.';
  function reply(q){q=q.toLowerCase();for(var i=0;i<KB.length;i++){for(var j=0;j<KB[i][0].length;j++){if(q.indexOf(KB[i][0][j])>-1)return KB[i][1]}}return FALL}
  function put(m){chat.insertBefore(m,ask);requestAnimationFrame(function(){m.classList.add('show')})}
  function add(c,t){put(el('div',c,t))}
  function setLeft(){left.textContent=(MAX-used)+' of '+MAX+' free questions left'}
  function lock(){
    locked=true;inp.disabled=true;form.querySelector('button').disabled=true;
    ask.querySelectorAll('button').forEach(function(b){b.disabled=true});
    left.textContent='Free questions used.';
    var m=el('div','msg ai');
    m.appendChild(document.createTextNode('You have used your 4 free questions. Log in to keep asking the Mentor and to save your progress.'));
    var a=el('a','btn sm','Log in to continue');a.href=SITE;
    a.style.display='block';a.style.marginTop='10px';a.style.textAlign='center';
    m.appendChild(a);put(m);
  }
  function submit(text){
    text=text.trim();
    if(!text||locked||used>=MAX)return;
    used++;setLeft();add('msg me',text);
    setTimeout(function(){
      add('msg ai',reply(text));
      if(used>=MAX)setTimeout(lock,900);
    },500);
  }
  form.addEventListener('submit',function(e){e.preventDefault();var v=inp.value;inp.value='';submit(v)});
  setLeft();
})();
`;

export default function LandingPage({ onLogin, onSignup }) {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.innerHTML = landingMarkup;

    // Run the original page interactions after its HTML has been mounted.
    const script = document.createElement("script");
    script.textContent = landingScript;
    root.appendChild(script);

    // Keep authentication inside the existing React app instead of navigating away.
    const handleAuthClick = (event) => {
      const link = event.target.closest('a[href="https://learn-code-frontend-xu8j.onrender.com/"]');
      if (!link || !root.contains(link)) return;
      event.preventDefault();
      const label = (link.textContent || "").trim().toLowerCase();
      if (label.includes("log in")) onLogin?.();
      else onSignup?.();
    };
    root.addEventListener("click", handleAuthClick);
    return () => {
      root.removeEventListener("click", handleAuthClick);
      root.innerHTML = "";
    };
  }, [onLogin, onSignup]);

  return <div className="learn-code-landing" ref={rootRef} />;
}

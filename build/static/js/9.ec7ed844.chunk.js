(this["webpackJsonptribute-ui"]=this["webpackJsonptribute-ui"]||[]).push([[9],{1084:function(e,t,n){"use strict";n.r(t),n.d(t,"default",(function(){return w}));var c=n(6),a=n(4),o=n(66),l=n(148),s=n(63),i=n(43),r=n(1);var d=n(14),j=n(12),b=n(195),u=n(50),O=n(16),m=n(480),f=n(82),h=n(476),p=n(163),v=n(0),x=["isOpen","onRequestClose"];function w(e){var t=e.modalProps,n=t.isOpen,w=t.onRequestClose,_=Object(o.a)(t,x),C=e.maybeContractWallet,k=void 0!==C&&C,N=Object(d.c)((function(e){var t=e.connectedMember;return!0===(null===t||void 0===t?void 0:t.isActiveMember)})),g=Object(d.c)((function(e){var t=e.connectedMember;return null===t||void 0===t?void 0:t.memberAddress})),y=Object(O.g)(),M=y.account,W=y.accountENS,A=y.connected,E=y.connectWeb3Modal,R=y.disconnectWeb3Modal,D=y.networkId,P=y.providerOptions,S=y.web3Modal,q=Object(O.e)(),F=q.defaultChainError,H=q.isDefaultChain,I=Object(s.g)().pathname,J=function(e){var t=Object(r.useRef)();return Object(r.useEffect)((function(){t.current=e})),t.current}(I),T=!1===H,G=D===j.b.GANACHE,z="/members/".concat(g),B=Object.entries(P).filter((function(e){var t=Object(a.a)(e,1)[0];return!Object(l.isMobile)()||"injected"!==t})).map((function(e){var t=G&&"walletconnect"===e[0];return Object(v.jsxs)("button",{"aria-label":"Connect to ".concat(e[1].display.name),className:"walletconnect__options-button \n            ".concat(A&&(null===S||void 0===S?void 0:S.cachedProvider)===e[0]?"walletconnect__options-button--connected":""),onClick:function(){return t?function(){}:E(e[0])},disabled:t,children:[Object(v.jsx)("span",{className:"wallet-name",children:e[1].display.name}),Object(v.jsx)(m.a,{providerName:e[0]})]},e[0])}));function K(){n&&J&&J===z&&w()}return Object(r.useEffect)((function(){n&&I===z&&J&&J!==z&&setTimeout(w,0)}),[n,z,w,I,J]),Object(v.jsxs)(h.a,Object(c.a)(Object(c.a)({keyProp:"connectWalletModal",isOpen:n,isOpenHandler:w},_),{},{children:[Object(v.jsx)("span",{className:"modal__close-button",onClick:function(){w()},children:Object(v.jsx)(p.a,{})}),Object(v.jsxs)("div",{children:[Object(v.jsx)("div",{className:"modal__title",children:"Connect Wallet"}),(!A||!T)&&Object(v.jsx)("div",{className:"modal__subtitle",children:"Choose your wallet"}),function(){if(!A||!k||T)return null;var e=N?Object(v.jsxs)(v.Fragment,{children:["As a member, you can"," ",Object(v.jsx)(i.b,{onClick:K,to:z,children:"set a delegate"})," ","to a key-based wallet, like MetaMask."]}):null;return Object(v.jsx)("p",{children:Object(v.jsxs)("small",{children:["Smart contract wallets are not generally supported for features like off-chain voting. ",e]})})}(),A&&T&&Object(v.jsxs)(v.Fragment,{children:[Object(v.jsx)("div",{className:"error-message",children:Object(v.jsx)("small",{children:(null===F||void 0===F?void 0:F.message)||""})}),Object(v.jsx)("div",{className:"loader--large-container",children:Object(v.jsx)(f.a,{})}),Object(v.jsxs)("div",{children:[Object(v.jsx)("small",{children:"Waiting for the right network"}),Object(v.jsx)(u.a,{}),Object(v.jsx)("br",{}),Object(v.jsx)("small",{children:"Switch networks from your wallet."})]})]}),M&&Object(v.jsx)("div",{className:"walletconnect__connected-address",children:Object(v.jsx)(b.a,{render:function(e){var t=e.elementRef,n=e.isCopied,c=e.setCopied,a=e.tooltipID;return Object(v.jsx)("span",{className:"walletconnect__connected-address-text","data-for":a,"data-tip":n?"copied!":W?"".concat(W," (").concat(M,")"):"copy",onClick:c,ref:t,children:W||M})},textToCopy:M})}),(!A||!T)&&Object(v.jsx)("div",{className:"walletconnect__options",children:B}),A&&Object(v.jsx)("button",{className:"walletconnect__disconnect-link-button",onClick:R,children:"Disconnect Wallet"})]})]}))}}}]);
//# sourceMappingURL=9.ec7ed844.chunk.js.map
(this["webpackJsonptribute-ui"]=this["webpackJsonptribute-ui"]||[]).push([[8],{1085:function(e,t,r){"use strict";r.r(t),r.d(t,"default",(function(){return T}));var n=r(3),s=r(4),o=r(1),a=r(150),c=r(41),i=r(44),d=r(10),u=r(9),l=r(50),b=r(36),j=r(40),p=r(35),f=r(6),O=r(5),h=r(2),x=r.n(h),g=r(14),m=r(25),w=r(28),v=r(62),N=r(16),P=r(73),I=r(51),S=r(27),E=r(53),F=r(0),V={skipIsActiveMemberCheck:!0};function k(e){var t=e.disabled,r=e.proposal.snapshotProposal,n=Object(o.useState)(),a=Object(s.a)(n,2),c=a[0],i=a[1],d=Object(g.c)((function(e){return e.contracts})),j=Object(g.c)((function(e){return e.contracts.DaoRegistryContract})),h=Object(N.g)(),k=h.account,M=h.web3Instance,A=Object(N.a)(),D=A.txEtherscanURL,R=A.txIsPromptOpen,y=A.txSend,C=A.txStatus,G=Object(N.c)().average,L=Object(b.f)(V),_=L.isDisabled,T=L.openWhyDisabledModal,W=L.WhyDisabledModal,U=Object(g.b)(),J=C===u.f.AWAITING_CONFIRM||C===u.f.PENDING,Y=C===u.f.FULFILLED,q=J||Y||R,z=_||q||t;function B(){return(B=Object(O.a)(x.a.mark((function e(){var t,n,s,o;return x.a.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(e.prev=0,j){e.next=3;break}throw new Error("No DAO Registry contract was found.");case 3:if(r){e.next=5;break}throw new Error("No Snapshot proposal was found.");case 5:if(k){e.next=7;break}throw new Error("No account found.");case 7:if(M){e.next=9;break}throw new Error("No Web3 instance was found.");case 9:return t=Object(w.e)(r.actionId,d),n=[j.contractAddress,r.idInDAO],s=Object(f.a)({from:k||""},G?{gasPrice:G}:null),e.next=14,y("processProposal",t.instance.methods,n,s);case 14:if(!e.sent){e.next=18;break}return e.next=18,U(Object(m.A)({account:k,daoRegistryContract:j,web3Instance:M}));case 18:e.next=24;break;case 20:e.prev=20,e.t0=e.catch(0),o=e.t0,i(o);case 24:case"end":return e.stop()}}),e,null,[[0,20]])})))).apply(this,arguments)}return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsxs)("div",{children:[Object(F.jsx)("button",{className:"proposaldetails__button",disabled:z,onClick:z?function(){}:function(){return B.apply(this,arguments)},children:J?Object(F.jsx)(E.a,{}):Y?"Done":"Process"}),Object(F.jsx)(p.a,{error:c,renderText:"Something went wrong"}),q&&Object(F.jsx)("div",{className:"form__submit-status-container",children:function(){switch(C){case u.f.AWAITING_CONFIRM:return Object(F.jsxs)(F.Fragment,{children:["Awaiting your confirmation",Object(F.jsx)(l.a,{})]});case u.f.PENDING:return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)(P.a,{intervalMs:2e3,messages:v.b,useFirstItemStart:!0,render:function(e){return Object(F.jsx)(S.a,{children:e},e)}}),Object(F.jsx)(I.a,{url:D,isPending:!0})]});case u.f.FULFILLED:return Object(F.jsxs)(F.Fragment,{children:[Object(F.jsx)("div",{children:"Proposal processed!"}),Object(F.jsx)(I.a,{url:D})]});default:return null}}()}),_&&Object(F.jsx)("button",{className:"button--help-centered",onClick:T,children:"Why is processing disabled?"})]}),Object(F.jsx)(W,{title:"Why is processing disabled?"})]})}var M=r(227),A=c.c.Completed,D=c.c.OffchainVotingGracePeriod,R=c.c.OffchainVotingSubmitResult,y=c.c.OffchainVoting,C=c.c.Process,G=c.c.Submit,L=d.a.FULFILLED,_=[u.b.offchainVotingVotingPeriod,u.b.offchainVotingGracePeriod];function T(e){var t,r=e.adapterName,c=e.proposal,d=e.renderAction,u=Object(b.c)(_),f=Object(s.a)(u.daoConfigurations,2),O=f[0],h=f[1],x=Object(i.e)(Object(o.useMemo)((function(){return{proposal:c}}),[c])),g=x.daoProposalVoteResult,m=x.daoProposalVote,w=x.proposalFlowStatusError,v=x.status,N=x.stopPollingForStatus,P=Object(i.c)(c.snapshotProposal),I=P.offchainVotingResults,S=P.offchainVotingResultsStatus,E=1e3*Number((null===m||void 0===m?void 0:m.gracePeriodStartingTime)||0),V=E+1e3*Number(h||0),T=1e3*Number((null===m||void 0===m?void 0:m.startingTime)||0),W=T+1e3*Number(O||0),U=null===(t=I[0])||void 0===t?void 0:t[1],J=(null===U||void 0===U?void 0:U.Yes.units)||0,Y=(null===U||void 0===U?void 0:U.No.units)||0,q=d&&d(Object(n.a)({},j.c.OffchainVotingContract,{adapterName:r,daoProposalVote:m,daoProposalVoteResult:g,gracePeriodEndMs:V,gracePeriodStartMs:E,proposal:c,status:v}));return Object(o.useEffect)((function(){v===R&&S===L&&J<=Y&&N()}),[Y,S,v,N,J]),Object(F.jsxs)(F.Fragment,{children:[(v===y||v===R||v===D||v===C||v===A)&&Object(F.jsx)(a.c,{countdownGracePeriodEndMs:V,countdownGracePeriodStartMs:E,countdownVotingEndMs:W,countdownVotingStartMs:T,renderStatus:function(e){if(e.hasGracePeriodEnded&&v===D)return Object(F.jsxs)("span",{children:["Grace period ended ",Object(F.jsx)("br",{})," ",Object(F.jsxs)("span",{style:{textTransform:"lowercase"},children:["Awaiting contract status",Object(F.jsx)(l.a,{})]})]})},votingResult:U}),Object(F.jsx)("div",{className:"proposaldetails__button-container",children:q||(v===G?Object(F.jsx)(M.a,{proposal:c}):v===y?Object(F.jsx)(a.b,{adapterName:r,proposal:c}):v===R?S!==L||J<=Y?null:Object(F.jsx)(a.a,{adapterName:r,proposal:c}):v===C||v===D?Object(F.jsx)(k,{disabled:v===D,proposal:c}):void 0)}),Object(F.jsx)(p.a,{error:w,renderText:"Something went wrong while getting the proposal's status"})]})}}}]);
//# sourceMappingURL=8.13520922.chunk.js.map
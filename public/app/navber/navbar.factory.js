export default function navbarFactory() {

  var shaerdData = [];

  shaerdData = [];
  return {
      getNavList:()=> shaerdData,
      setNavList:lists=> shaerdData = lists,
      push: suite=> shaerdData.push(suite),
    };
}

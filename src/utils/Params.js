function CopyParams(prevState, nextState) {
  var newState = {};

  for (var key in prevState) {
    newState[key] = (nextState[key]) ? nextState[key] : prevState[key];
  }

  return newState;
}

export { CopyParams };

export const initialState = null;

export const reducer = (state, action) => {
    if (action.type === 'SET_USER')
        return action.user;
    if (action.type === 'UPDATE_USER') {
        return {
            ...state,
            followers: action.followers,
            following: action.following
        }
    }
    if (action.type === 'UPDATE_PICTURE') {
        return {
            ...state,
            profileImage: action.image
        }
    }
    if (action.type === 'CLEAR')
        return null;
    return state;
}
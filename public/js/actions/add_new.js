const APPEND_NEW_DIALOGUE = 'APPEND_NEW_DIALOGUE';
const SHOW_ADD_NEW_DIALOGUE_FORM = 'SHOW_ADD_NEW_DIALOGUE_FORM';

export function appendNewDialogue(value) {
    return {
        type: APPEND_NEW_DIALOGUE,
        value: value
    }
}
export function showAddNewDialogueForm(value) {
    return {
        type: SHOW_ADD_NEW_DIALOGUE_FORM,
        value: value
    }
}

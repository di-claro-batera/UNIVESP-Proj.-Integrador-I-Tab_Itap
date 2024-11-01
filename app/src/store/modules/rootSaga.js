import { all } from 'redux-saga/effects';

import manicure from '../modules/manicure/sagas';

export default function* rootSaga() {
    return yield all([manicure]);
};


import noop from 'lodash/noop';
import { createContext } from 'react';


export const DmtContext = createContext<unknown>({
    setAadharNumber: noop,
    setMobileNumber: noop,
    setConsumerName: noop,
    setBankName: noop,
    setFingerprintData: noop,
    aadharNumber: '',
    mobileNumber: '',
    consumerName: '',
    bankName: '',
    fingerprintData:'',
    scanFingerprint: noop,
});

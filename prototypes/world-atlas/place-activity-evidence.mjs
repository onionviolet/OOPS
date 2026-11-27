import {readPinnedPlayReceipt} from './pinned-play-receipt.mjs';

export const activityReceiptSpecs = {
    hp:{
        path:'docs/representations/evidence/harry-library-standard-2026-11-26/proof.json',
        fingerprint:'bc02fa94be4efa0cac29aef8802970d9e4ce710e1fe0ec2786b86d049247ece2',
        life:'Harry Potter, prepared school day',
        action:'Move the ladder, levitate the book, copy the chart and write the assignment',
        playedBuild:({after:r})=>r?.route?.includes('both retrieval methods')&&r.manualMinutes===15&&
            r.homeworkMinutes===30&&r.magicTries===2&&r.notes===2&&r.marked===1&&r.errors?.length===0&&r.servedBundleSha256,
    },
    lotm:{
        path:'docs/representations/evidence/lotm-charm-materials-2026-11-25/proof.json',
        fingerprint:'91e552f9400386c41fea6c2b656d8124b408168a7acfe4775943960a6ae61b60',
        life:'Tingen eligible-maker fixture',
        action:'Approve and collect the office materials',
        playedBuild:r=>r.route?.includes('normal office approval/collection')&&
            r.officeOrderObtainedBy==='normal approval action, no seeded ticket'&&
            r.officeAndPersonalMaterialsConsumedBy==='existing Slumber inscription'&&r.bundleHash,
    },
};

export const loadPlaceActivityEvidence = (root,world) => readPinnedPlayReceipt(root,activityReceiptSpecs[world]);

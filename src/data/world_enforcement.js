export const watchKitLaw={
    id:'village.watch.kit',costs:[{resource:'coins',kind:'debt',amount:50}],
    detection:'unreturnedKit',enforcer:'Tessa',consequences:[{kind:'patrolHold'}],
    penalty:'kitDebt',reason:'A loaned watch kit was kept when its return fell due.',
};
export const enforcementCases=[
    {id:'dcc.guild.door',source:'dcc.institution.tutorial-guild',locator:'en b1 c2 p104',costs:[],detection:'visibleHostiles',
        enforcer:'Mordecai',penalty:'refuseEntry',consequences:[{kind:'doorStaysClosed'}],reason:'Hostiles are visible outside the tutorial room.'},
    {id:'ph.floor.protection',source:'ph.law.floor-penalty',locator:'en b10 c18 p7',costs:[{resource:'Nevermore points',kind:'deduction',amount:null}],
        detection:'identifiedInnocentKilled',enforcer:'Floor system',penalty:'pointPenalty',consequences:[{kind:'largerPenaltyOnRepetition'}],reason:'The victim was classified as innocent.'},
    {id:'az.contract.attendance',source:'az.law.contract-article-four',locator:'en b2 c10 p31',costs:[],detection:'absentFromClass',
        enforcer:'Claire',penalty:'reportAbsence',consequences:[],reason:'Attendance is checked under the contract. Further sanctions are unspecified.'},
];

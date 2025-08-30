import {create} from 'zustand'

type status = Record<string,boolean>

type usersStatusStoreType = {
    status:status,
    addStatus:(id:string,status:boolean)=>void,
    getStatus:(id:string)=>boolean
}

export const usersStatusStore = create<usersStatusStoreType>((set,get)=>({
    status:{},
    addStatus:(id,status)=>{
        const copy = {...get().status}
        copy[id] =status;
        set({status:copy})
    },
    getStatus:(id)=>{
        return get().status[id]
    }
}))
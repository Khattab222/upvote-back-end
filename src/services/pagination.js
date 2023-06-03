

export const pagination = ({page =1,size=5} ={}) =>{
    if (page <=0) page = 1
    if (size <=0) page = 1

    const perPage = parseInt( size);
    const skip = (parseInt( page) -1) * parseInt( size)
   const nextPage= parseInt( page) + 1
   const prePage = parseInt( page) -1
   const currentPage = parseInt( page) 

    return {
        perPage,skip,nextPage,prePage,currentPage
    }

 }
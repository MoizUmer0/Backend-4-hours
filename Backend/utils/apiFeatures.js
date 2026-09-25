class ApiFeatures {
    constructor(query,queryStr){
        this.query = query
        this.queryStr = queryStr
    }
    search(){
        const keyword = this.queryStr.keyword?{name:{
            $regex:this.queryStr.keyword,
            $options:"i"
        }}:{}
        this.query =this.query.find({...keyword})
        return this
    }
    filter(){
        const querycopy = {...this.queryStr}
        // Removing some fields for category

        const removefileds = ["keyword","page","limit"]

        removefileds.forEach(key=>delete querycopy[key])

        // Filter For Price and Rating 
  
        let queryStr = JSON.stringify(querycopy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key)=>`$${key}`)

        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }
}

module.exports = ApiFeatures

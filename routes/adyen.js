const { Router } = require('express')
const router = Router()

router.post('/adyen', (req,res) => {
	/*----------  funciones  ----------*/
	
	function validate(stringv){
		if (!stringv) {
			errors = "Some error occurs"
			success = false
			res.json({'success':success,'msg':errors})
			return false
		}else{
			return true
		}
	}

	function valvers(){
		if (!version) {
			ver = 25
		}else{
			ver = version
		}
	}

	/*----------  end funciones  ----------*/
	
	const { key } = req.body
	const { cc } = req.body
	const { version } = req.body
	valvers()
	const adyenEncrypt = require('node-adyen-encrypt')(ver);

	/*----------  validate data  ----------*/

	valid = validate(cc)
	valid2 = validate(key)

	/*----------  start encrypt  ----------*/
	
	if (valid2 | valid == true) {
		const card = cc.split("|")
		const cardNumber = card[0]
		const expiryMonth = card[1]
		const expiryYear = card[2]
		const cvc = card[3]
		
		const adyenKey = key
		const options = {}
		const generationtime = new Date().toISOString()
		const cardData = {
         number : cardNumber,
         cvc : cvc,    
         holderName : 'John Doe',   
         expiryMonth : expiryMonth,
         expiryYear : expiryYear,   
         generationtime : generationtime 
     }
     const cseInstance   = adyenEncrypt.createEncryption(adyenKey, options);
     const validate      = cseInstance.validate(cardData);
     const validate1     = validate['valid']
     const number = cseInstance.encrypt(cardData);
     const month = cseInstance.encrypt(cardData);
     const year = cseInstance.encrypt(cardData);
     const cvv = cseInstance.encrypt(cardData);
     // console.log(validate)
     if (validate1) {
     	res.json({
     		"success":validate1,
     		"msg":"Encrypted",
     		"number":number,
     		"month":month,
     		"year":year,
     		"cvv":cvv,
     		"by":"@ThevenRex_tu_papi"
     	})
     }else{
     	errors = "Some error occurs"
		success = false
		res.json({'success':success,'msg':errors})
     }
	}
})

module.exports = router
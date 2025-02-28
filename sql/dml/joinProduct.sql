SELECT dubai.*, product.purchased_product
FROM dubai
left JOIN product ON dubai.patientcode = product.patientcode

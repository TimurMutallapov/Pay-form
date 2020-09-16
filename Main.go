package main

import (
	"encoding/json"
	"fmt"
	"net/http"
)



func main() {

	http.Handle("/",http.FileServer(http.Dir("static")))
	http.HandleFunc("/kek", func(w http.ResponseWriter, r*http.Request){
		name := r.FormValue("CardName")
		cvc := r.FormValue("CVC")
		cardNumber := r.FormValue("CardNumber")
		date := r.FormValue("Date")
		fmt.Printf("%T\n", name)
		fmt.Printf("%T\n", cvc)
		fmt.Printf("%T\n", cardNumber)
		fmt.Printf("%T\n", date)

		type Pay struct {
			NAME string `json:"Name"`
			CVC string	`json:"CVC"`
			CARDNUMBER string `json:"CardNumber"`
			DATE string `json:"Date"`
		}
		Xuy := Pay{name,cvc,cardNumber,date}
		bytes,err := json.Marshal(Xuy)
		if err != nil {
			fmt.Println("Zalupa")
		}
		fmt.Println("Name=",name)
		fmt.Println("CVC=",cvc)
		fmt.Println("Номер Карты :", cardNumber)
		fmt.Println("Date", date)

		fmt.Println(string( bytes))

	})

	fmt.Println("Сервер работает...")
	http.ListenAndServe(":8008",nil)


}



import { TemplateLiteral } from "@angular/compiler"
import { Tema } from "./Tema"
import { Usuario } from "./Usuario"

export class Postagem {
    public id: number
    public titulo: string
    public texto: string
    public foto: string
    public bebida: string
    public data: Date
    public tema: Tema 
    public usuario: Usuario
}
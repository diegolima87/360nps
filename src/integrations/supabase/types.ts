export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assinaturas: {
        Row: {
          data_fim: string
          data_inicio: string
          id_usuario: string | null
          plano: string | null
          status: string | null
        }
        Insert: {
          data_fim: string
          data_inicio: string
          id_usuario?: string | null
          plano?: string | null
          status?: string | null
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          id_usuario?: string | null
          plano?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_id_usuario_fkey"
            columns: ["id_usuario"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      franqueadoras: {
        Row: {
          cor_primaria: string | null
          id: string
          logo_url: string | null
          nome: string
        }
        Insert: {
          cor_primaria?: string | null
          id?: string
          logo_url?: string | null
          nome: string
        }
        Update: {
          cor_primaria?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
        }
        Relationships: []
      }
      franqueados: {
        Row: {
          email: string
          id: string
          id_franqueadora: string | null
          nome: string
        }
        Insert: {
          email: string
          id?: string
          id_franqueadora?: string | null
          nome: string
        }
        Update: {
          email?: string
          id?: string
          id_franqueadora?: string | null
          nome?: string
        }
        Relationships: [
          {
            foreignKeyName: "franqueados_id_franqueadora_fkey"
            columns: ["id_franqueadora"]
            isOneToOne: false
            referencedRelation: "franqueadoras"
            referencedColumns: ["id"]
          },
        ]
      }
      pesquisas: {
        Row: {
          data_fim: string
          data_inicio: string
          id: string
          id_franqueadora: string | null
          link: string | null
          nome: string
          pergunta: string
          publico_alvo: string
        }
        Insert: {
          data_fim: string
          data_inicio: string
          id?: string
          id_franqueadora?: string | null
          link?: string | null
          nome: string
          pergunta: string
          publico_alvo: string
        }
        Update: {
          data_fim?: string
          data_inicio?: string
          id?: string
          id_franqueadora?: string | null
          link?: string | null
          nome?: string
          pergunta?: string
          publico_alvo?: string
        }
        Relationships: [
          {
            foreignKeyName: "pesquisas_id_franqueadora_fkey"
            columns: ["id_franqueadora"]
            isOneToOne: false
            referencedRelation: "franqueadoras"
            referencedColumns: ["id"]
          },
        ]
      }
      respostas: {
        Row: {
          autorizacao: boolean | null
          comentario: string | null
          data_envio: string | null
          id: string
          id_franqueado: string | null
          id_pesquisa: string | null
          nota_nps: number | null
          tipo_resposta: string | null
        }
        Insert: {
          autorizacao?: boolean | null
          comentario?: string | null
          data_envio?: string | null
          id?: string
          id_franqueado?: string | null
          id_pesquisa?: string | null
          nota_nps?: number | null
          tipo_resposta?: string | null
        }
        Update: {
          autorizacao?: boolean | null
          comentario?: string | null
          data_envio?: string | null
          id?: string
          id_franqueado?: string | null
          id_pesquisa?: string | null
          nota_nps?: number | null
          tipo_resposta?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "respostas_id_franqueado_fkey"
            columns: ["id_franqueado"]
            isOneToOne: false
            referencedRelation: "franqueados"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "respostas_id_pesquisa_fkey"
            columns: ["id_pesquisa"]
            isOneToOne: false
            referencedRelation: "pesquisas"
            referencedColumns: ["id"]
          },
        ]
      }
      usuarios: {
        Row: {
          data_criacao: string | null
          email: string
          id: string
          id_franqueadora: string | null
          nome: string
          role: string
          senha: string
        }
        Insert: {
          data_criacao?: string | null
          email: string
          id?: string
          id_franqueadora?: string | null
          nome: string
          role: string
          senha: string
        }
        Update: {
          data_criacao?: string | null
          email?: string
          id?: string
          id_franqueadora?: string | null
          nome?: string
          role?: string
          senha?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

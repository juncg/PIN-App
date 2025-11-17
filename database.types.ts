export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      Business: {
        Row: {
          created_at: string
          description: string | null
          id: number
          name: string | null
          owner_id: string
          verification: Database["public"]["Enums"]["Verification"] | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          owner_id: string
          verification?: Database["public"]["Enums"]["Verification"] | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string | null
          owner_id?: string
          verification?: Database["public"]["Enums"]["Verification"] | null
        }
        Relationships: [
          {
            foreignKeyName: "Business_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      Category: {
        Row: {
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      Comment: {
        Row: {
          comment_locked_state:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          created_at: string
          creator_id: string
          forum_id: number | null
          id: number
          likes: number | null
          state: Database["public"]["Enums"]["Post_State"] | null
          superlikes: number | null
          text: string | null
        }
        Insert: {
          comment_locked_state?:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          created_at?: string
          creator_id: string
          forum_id?: number | null
          id?: number
          likes?: number | null
          state?: Database["public"]["Enums"]["Post_State"] | null
          superlikes?: number | null
          text?: string | null
        }
        Update: {
          comment_locked_state?:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          created_at?: string
          creator_id?: string
          forum_id?: number | null
          id?: number
          likes?: number | null
          state?: Database["public"]["Enums"]["Post_State"] | null
          superlikes?: number | null
          text?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Comment_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
        ]
      }
      Comment_Post: {
        Row: {
          comment_id: number
          offer_id: number | null
          petition_id: number | null
          referenced_comment_id: number | null
          review_id: number | null
        }
        Insert: {
          comment_id?: number
          offer_id?: number | null
          petition_id?: number | null
          referenced_comment_id?: number | null
          review_id?: number | null
        }
        Update: {
          comment_id?: number
          offer_id?: number | null
          petition_id?: number | null
          referenced_comment_id?: number | null
          review_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Comment_Post_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: true
            referencedRelation: "Comment"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_Post_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "Offer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_Post_petition_id_fkey"
            columns: ["petition_id"]
            isOneToOne: false
            referencedRelation: "Petition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Comment_Post_referenced_comment_id_fkey"
            columns: ["referenced_comment_id"]
            isOneToOne: false
            referencedRelation: "Comment_Post"
            referencedColumns: ["comment_id"]
          },
          {
            foreignKeyName: "Comment_Post_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "Review"
            referencedColumns: ["id"]
          },
        ]
      }
      Forum: {
        Row: {
          allows_custom_tags: boolean | null
          banner: string | null
          business_id: number
          created_at: string
          description: string | null
          followers: number | null
          id: number
          name: string | null
          profile_picture: string | null
        }
        Insert: {
          allows_custom_tags?: boolean | null
          banner?: string | null
          business_id: number
          created_at?: string
          description?: string | null
          followers?: number | null
          id?: number
          name?: string | null
          profile_picture?: string | null
        }
        Update: {
          allows_custom_tags?: boolean | null
          banner?: string | null
          business_id?: number
          created_at?: string
          description?: string | null
          followers?: number | null
          id?: number
          name?: string | null
          profile_picture?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Forum_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "Business"
            referencedColumns: ["id"]
          },
        ]
      }
      Forum_Tag: {
        Row: {
          forum_id: number
          tag_id: number
        }
        Insert: {
          forum_id: number
          tag_id: number
        }
        Update: {
          forum_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Forum_Tag_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Forum_Tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      Offer: {
        Row: {
          comment_locked_state: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at: string
          creator_id: string
          current_progress: number
          fee: number
          forum_id: number | null
          id: number
          images: string[] | null
          likes: number
          state: Database["public"]["Enums"]["Post_State"]
          superlikes: number
          target_completition_date: string
          target_progress: number
          text: string
          title: string
        }
        Insert: {
          comment_locked_state?: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at?: string
          creator_id?: string
          current_progress?: number
          fee?: number
          forum_id?: number | null
          id?: number
          images?: string[] | null
          likes?: number
          state?: Database["public"]["Enums"]["Post_State"]
          superlikes?: number
          target_completition_date: string
          target_progress?: number
          text?: string
          title?: string
        }
        Update: {
          comment_locked_state?: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at?: string
          creator_id?: string
          current_progress?: number
          fee?: number
          forum_id?: number | null
          id?: number
          images?: string[] | null
          likes?: number
          state?: Database["public"]["Enums"]["Post_State"]
          superlikes?: number
          target_completition_date?: string
          target_progress?: number
          text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Offer_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Offer_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
        ]
      }
      Offer_Product: {
        Row: {
          offer_id: number
          product_id: number
        }
        Insert: {
          offer_id: number
          product_id: number
        }
        Update: {
          offer_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Offer_Product_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "Offer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Offer_Product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Offer_Tag: {
        Row: {
          offer_id: number
          tag_id: number
        }
        Insert: {
          offer_id: number
          tag_id: number
        }
        Update: {
          offer_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Offer_Tag_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "Offer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Offer_Tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      Petition: {
        Row: {
          comment_locked_state: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at: string
          creator_id: string
          current_progress: number
          forum_id: number | null
          id: number
          likes: number
          state: Database["public"]["Enums"]["Post_State"]
          superlikes: number
          target_progress: number | null
          text: string
          title: string
        }
        Insert: {
          comment_locked_state?: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at?: string
          creator_id?: string
          current_progress?: number
          forum_id?: number | null
          id?: number
          likes?: number
          state?: Database["public"]["Enums"]["Post_State"]
          superlikes?: number
          target_progress?: number | null
          text?: string
          title?: string
        }
        Update: {
          comment_locked_state?: Database["public"]["Enums"]["Comment_Locked_State"]
          created_at?: string
          creator_id?: string
          current_progress?: number
          forum_id?: number | null
          id?: number
          likes?: number
          state?: Database["public"]["Enums"]["Post_State"]
          superlikes?: number
          target_progress?: number | null
          text?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Petition_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Petition_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
        ]
      }
      Petition_Product: {
        Row: {
          petition_id: number
          product_id: number
        }
        Insert: {
          petition_id: number
          product_id: number
        }
        Update: {
          petition_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Petition_Product_petition_id_fkey"
            columns: ["petition_id"]
            isOneToOne: false
            referencedRelation: "Petition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Petition_Product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Petition_Tag: {
        Row: {
          petition_id: number
          tag_id: number
        }
        Insert: {
          petition_id: number
          tag_id: number
        }
        Update: {
          petition_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Petition_Tag_petition_id_fkey"
            columns: ["petition_id"]
            isOneToOne: false
            referencedRelation: "Petition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Petition_Tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      Product: {
        Row: {
          associated_links: string[] | null
          created_at: string
          description: string
          id: number
          msrp: number | null
          name: string
          rating: number | null
        }
        Insert: {
          associated_links?: string[] | null
          created_at?: string
          description?: string
          id?: number
          msrp?: number | null
          name?: string
          rating?: number | null
        }
        Update: {
          associated_links?: string[] | null
          created_at?: string
          description?: string
          id?: number
          msrp?: number | null
          name?: string
          rating?: number | null
        }
        Relationships: []
      }
      Product_Business: {
        Row: {
          business_id: number
          created_at: string
          product_id: number
        }
        Insert: {
          business_id: number
          created_at?: string
          product_id: number
        }
        Update: {
          business_id?: number
          created_at?: string
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Product_Business_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "Business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_Business_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Product_Category: {
        Row: {
          category_id: number
          product_id: number
        }
        Insert: {
          category_id: number
          product_id: number
        }
        Update: {
          category_id?: number
          product_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Product_Category_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_Category_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
        ]
      }
      Product_Subcategory: {
        Row: {
          product_id: number
          subcategory_id: number
        }
        Insert: {
          product_id: number
          subcategory_id: number
        }
        Update: {
          product_id?: number
          subcategory_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Product_Subcategory_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Product_Subcategory_subcategory_id_fkey"
            columns: ["subcategory_id"]
            isOneToOne: false
            referencedRelation: "Subcategory"
            referencedColumns: ["id"]
          },
        ]
      }
      Review: {
        Row: {
          comment_locked_state:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          content: string | null
          created_at: string
          creator_id: string
          forum_id: number | null
          id: number
          likes: number | null
          stars: number
          state: Database["public"]["Enums"]["Post_State"] | null
          superlikes: number | null
          title: string | null
        }
        Insert: {
          comment_locked_state?:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          content?: string | null
          created_at?: string
          creator_id: string
          forum_id?: number | null
          id?: number
          likes?: number | null
          stars: number
          state?: Database["public"]["Enums"]["Post_State"] | null
          superlikes?: number | null
          title?: string | null
        }
        Update: {
          comment_locked_state?:
            | Database["public"]["Enums"]["Comment_Locked_State"]
            | null
          content?: string | null
          created_at?: string
          creator_id?: string
          forum_id?: number | null
          id?: number
          likes?: number | null
          stars?: number
          state?: Database["public"]["Enums"]["Post_State"] | null
          superlikes?: number | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Review_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
        ]
      }
      Review_Product: {
        Row: {
          product_id: number
          review_id: number
        }
        Insert: {
          product_id: number
          review_id: number
        }
        Update: {
          product_id?: number
          review_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Review_Product_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "Product"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_Product_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "Review"
            referencedColumns: ["id"]
          },
        ]
      }
      Review_Tag: {
        Row: {
          review_id: number
          tag_id: number
        }
        Insert: {
          review_id: number
          tag_id: number
        }
        Update: {
          review_id?: number
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Review_Tag_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "Review"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Review_Tag_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "Tag"
            referencedColumns: ["id"]
          },
        ]
      }
      Subcategory: {
        Row: {
          category_id: number | null
          created_at: string
          id: number
          name: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string
          id?: number
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Subcategory_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Category"
            referencedColumns: ["id"]
          },
        ]
      }
      Tag: {
        Row: {
          created_at: string
          id: number
          name: string | null
          times_used: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          times_used?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          times_used?: number | null
        }
        Relationships: []
      }
      User: {
        Row: {
          banner: string | null
          birth_date: string | null
          id: string
          name: string | null
          profile_picture: string | null
          public_forum_follows: boolean
          public_likes: boolean
          public_offer_subscriptions: boolean
          public_petition_subscriptions: boolean
          public_user_follows: boolean
          surnames: string | null
          username: string
        }
        Insert: {
          banner?: string | null
          birth_date?: string | null
          id: string
          name?: string | null
          profile_picture?: string | null
          public_forum_follows?: boolean
          public_likes?: boolean
          public_offer_subscriptions?: boolean
          public_petition_subscriptions?: boolean
          public_user_follows?: boolean
          surnames?: string | null
          username: string
        }
        Update: {
          banner?: string | null
          birth_date?: string | null
          id?: string
          name?: string | null
          profile_picture?: string | null
          public_forum_follows?: boolean
          public_likes?: boolean
          public_offer_subscriptions?: boolean
          public_petition_subscriptions?: boolean
          public_user_follows?: boolean
          surnames?: string | null
          username?: string
        }
        Relationships: []
      }
      User_Business: {
        Row: {
          business_id: number
          user_id: string
        }
        Insert: {
          business_id: number
          user_id: string
        }
        Update: {
          business_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Business_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "Business"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Business_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Forum: {
        Row: {
          forum_id: number
          user_id: string
        }
        Insert: {
          forum_id: number
          user_id: string
        }
        Update: {
          forum_id?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "Forum_User_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "Forum"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Forum_User_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Offer: {
        Row: {
          email_notification: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked: boolean
          native_notification: Database["public"]["Enums"]["Chosen_Notification_State"]
          offer_id: number
          subscribed: boolean
          user_id: string
        }
        Insert: {
          email_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked?: boolean
          native_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          offer_id: number
          subscribed?: boolean
          user_id: string
        }
        Update: {
          email_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked?: boolean
          native_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          offer_id?: number
          subscribed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Offer_offer_id_fkey"
            columns: ["offer_id"]
            isOneToOne: false
            referencedRelation: "Offer"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Offer_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Petition: {
        Row: {
          created_at: string
          email_notification: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked: boolean
          native_notification: Database["public"]["Enums"]["Chosen_Notification_State"]
          petition_id: number
          subscribed: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          email_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked?: boolean
          native_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          petition_id: number
          subscribed?: boolean
          user_id: string
        }
        Update: {
          created_at?: string
          email_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          liked?: boolean
          native_notification?: Database["public"]["Enums"]["Chosen_Notification_State"]
          petition_id?: number
          subscribed?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Petition_petition_id_fkey"
            columns: ["petition_id"]
            isOneToOne: false
            referencedRelation: "Petition"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Petition_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User_Review: {
        Row: {
          liked: boolean
          review_id: number
          stars: number
          user_id: string
        }
        Insert: {
          liked: boolean
          review_id: number
          stars?: number
          user_id?: string
        }
        Update: {
          liked?: boolean
          review_id?: number
          stars?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_Review_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "Review"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_Review_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
      User_User: {
        Row: {
          following_id: string
          user_id: string
        }
        Insert: {
          following_id: string
          user_id: string
        }
        Update: {
          following_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "User_User_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "User_User_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "User"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_likes: {
        Args: { post_id: number; target_table: string }
        Returns: number
      }
      count_subscribers: {
        Args: { post_id: number; target_table: string }
        Returns: number
      }
      delta_likes: {
        Args: { given_user_id: string; post_id: number; target_table: string }
        Returns: number
      }
      get_product_rating_distribution: {
        Args: { product_id_input: number }
        Returns: Database["public"]["CompositeTypes"]["rating_distribution_item"][]
        SetofOptions: {
          from: "*"
          to: "rating_distribution_item"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      toggle_like: {
        Args: { given_user_id: string; post_id: number; target_table: string }
        Returns: {
          new_like_count: number
          user_liked: boolean
        }[]
      }
      toggle_subscription: {
        Args: { given_user_id: string; post_id: number; target_table: string }
        Returns: {
          new_subscription_count: number
          user_subscribed: boolean
        }[]
      }
      update_product_rating: {
        Args: { p_product_id: number }
        Returns: undefined
      }
    }
    Enums: {
      Chosen_Notification_State:
        | "Frequent"
        | "Infrequent"
        | "None"
        | "OnlyWhenGoalReached"
      Comment_Locked_State: "Locked" | "Unlocked"
      Post_State: "Draft" | "Posted" | "Cancelled"
      Verification: "Unverified" | "Paid" | "Official"
    }
    CompositeTypes: {
      rating_distribution_item: {
        stars: number | null
        count: number | null
        percentage: number | null
      }
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      Chosen_Notification_State: [
        "Frequent",
        "Infrequent",
        "None",
        "OnlyWhenGoalReached",
      ],
      Comment_Locked_State: ["Locked", "Unlocked"],
      Post_State: ["Draft", "Posted", "Cancelled"],
      Verification: ["Unverified", "Paid", "Official"],
    },
  },
} as const

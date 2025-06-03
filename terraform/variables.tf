variable "aws_region" {
  default = "ap-southeast-2"
}

variable "ami_id" {
  description = "AMI ID for EC2 (ubuntu)"
  type        = string
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "Nama EC2 Key Pair untuk SSH"
  type        = string
}

variable "security_group_id" {
  description = "ID dari Security Group yang sudah dibuat"
  type        = string
}

variable "ecr_repo_name" {
  default = "todo-list-devops-project"
}
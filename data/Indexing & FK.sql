
## ==================FIELD TYPE CHANGES==================
ALTER TABLE `menu` 
CHANGE COLUMN `menu_type_id` `menu_type_id` TINYINT(1) NOT NULL ,
CHANGE COLUMN `order` `order` TINYINT(1) NOT NULL ;

ALTER TABLE `menu_type` 
CHANGE COLUMN `menu_type_id` `menu_type_id` TINYINT(1) NOT NULL AUTO_INCREMENT ;

ALTER TABLE `node-class` 
CHANGE COLUMN `node_type_id` `node_type_id` TINYINT(1) NOT NULL ,
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ,
CHANGE COLUMN `encrypt_status` `encrypt_status` TINYINT(1) NOT NULL DEFAULT '1' ,
CHANGE COLUMN `status` `status` TINYINT(1) NOT NULL ,
CHANGE COLUMN `type` `type` TINYINT(1) NOT NULL DEFAULT '1' ;

ALTER TABLE `node-class-property` 
CHANGE COLUMN `node_type_id` `node_type_id` TINYINT(1) NOT NULL ,
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ,
CHANGE COLUMN `encrypt_status` `encrypt_status` TINYINT(1) NOT NULL DEFAULT '1' ;

ALTER TABLE `node-instance` 
CHANGE COLUMN `node_type_id` `node_type_id` TINYINT(1) NOT NULL ,
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ,
CHANGE COLUMN `encrypt_status` `encrypt_status` TINYINT(1) NOT NULL DEFAULT '1' ,
CHANGE COLUMN `status` `status` TINYINT(1) NOT NULL ;

ALTER TABLE `node-instance-property` 
CHANGE COLUMN `node_type_id` `node_type_id` TINYINT(1) NOT NULL ,
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ,
CHANGE COLUMN `encrypt_status` `encrypt_status` TINYINT(1) NOT NULL DEFAULT '1' ;

ALTER TABLE `node-sub-class` 
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ;

ALTER TABLE `node-type` 
CHANGE COLUMN `is_enable` `is_enable` TINYINT(1) NOT NULL DEFAULT '1' ,
CHANGE COLUMN `sequence` `sequence` MEDIUMINT NOT NULL ;
ALTER TABLE `node-type` 
CHANGE COLUMN `node_type_id` `node_type_id` TINYINT(1) NOT NULL AUTO_INCREMENT ;


ALTER TABLE `node-x-y-relation` 
CHANGE COLUMN `is_version` `is_version` TINYINT(1) NOT NULL DEFAULT '0' ;

## ==================INDEXING & FK CONSTRAINTS==================
#-------------------------------menu-------------------------------	
	ALTER TABLE `menu` 
	ADD INDEX `fk_menu_type_idx` (`menu_type_id` ASC);
	ALTER TABLE `menu` 
	ADD CONSTRAINT `fk_menu_type`
	  FOREIGN KEY (`menu_type_id`)
	  REFERENCES `menu_type` (`menu_type_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;

#-------------------------------menu_action-------------------------------	
	ALTER TABLE `menu_action` 
	ADD INDEX `fk_menu_action_1_idx` (`menu_id` ASC);
	ALTER TABLE `menu_action` 
	ADD CONSTRAINT `fk_menu_id`
	  FOREIGN KEY (`menu_id`)
	  REFERENCES `menu` (`menu_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;	

#-------------------------------node-class-------------------------------
	ALTER TABLE `node-class` 
	ADD INDEX `fk_node-class_node_type_idx` (`node_type_id` ASC),
	ADD INDEX `fk_node-class_node_id_idx` (`node_id` ASC);
	ALTER TABLE `node-class` 
	ADD CONSTRAINT `fk_node-class_node_type`
	  FOREIGN KEY (`node_type_id`)
	  REFERENCES `node-type` (`node_type_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-class_node_id`
	  FOREIGN KEY (`node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;

#-------------------------------node-class-property-------------------------------
	DELETE `ncp` FROM `node-class-property` AS `ncp` 
	LEFT JOIN `node` AS `nd` ON `nd`.`node_id` = `ncp`.`node_id` 
	WHERE `nd`.`node_id` IS NULL;

	ALTER TABLE `node-class-property` 
	ADD INDEX `fk_node-class-property_parent_idx` (`node_class_property_parent_id` ASC),
	ADD INDEX `fk_node-class-property_node_id_idx` (`node_id` ASC),
	ADD INDEX `fk_node-class-property_class_id_idx` (`node_class_id` ASC),
	ADD INDEX `fk_node-class-property_type_id_idx` (`node_type_id` ASC);
	ALTER TABLE `node-class-property` 	
	ADD CONSTRAINT `fk_node-class-property_node_id`
	  FOREIGN KEY (`node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-class-property_class_id`
	  FOREIGN KEY (`node_class_id`)
	  REFERENCES `node-class` (`node_class_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-class-property_type_id`
	  FOREIGN KEY (`node_type_id`)
	  REFERENCES `node-type` (`node_type_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;


#-------------------------------node-instance-------------------------------
	DELETE `ni` FROM `node-instance` AS `ni` 
	LEFT JOIN `node-class` AS nc ON `nc`.`node_class_id` = `ni`.`node_class_id` 
	WHERE `nc`.`node_class_id` IS NULL;

	DELETE `ni` FROM `node-instance` AS `ni` 
	LEFT JOIN `node` AS `nd` ON `nd`.`node_id` = `ni`.`node_id` 
	WHERE `nd`.`node_id` IS NULL;

	ALTER TABLE `node-instance` 
	ADD INDEX `fk_node-instance_class_id_idx` (`node_class_id` ASC),
	ADD INDEX `fk_node-instance_node_id_idx` (`node_id` ASC),
	ADD INDEX `fk_node-instance_type_id_idx` (`node_type_id` ASC);
	ALTER TABLE `node-instance` 
	ADD CONSTRAINT `fk_node-instance_class_id`
	  FOREIGN KEY (`node_class_id`)
	  REFERENCES `node-class` (`node_class_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-instance_node_id`
	  FOREIGN KEY (`node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-instance_type_id`
	  FOREIGN KEY (`node_type_id`)
	  REFERENCES `node-type` (`node_type_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;

#-------------------------------node-instance-property-------------------------------
	DELETE 	`nip` FROM `node-instance-property` AS `nip` 
	LEFT JOIN `node-instance` AS `ni` ON `ni`.`node_instance_id` = `nip`.`node_instance_id` 
	WHERE `ni`.`node_instance_id` IS NULL;

	DELETE `nip` FROM `node-instance-property` AS `nip` 
	LEFT JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id` 
	WHERE `ncp`.`node_class_property_id` IS NULL;

  	ALTER TABLE `node-instance-property` 
  	ADD INDEX `fk_node-instance-property_instance_id_idx` (`node_instance_id` ASC),
	ADD INDEX `fk_node-instance-property_class_prop_id_idx` (`node_class_property_id` ASC),
	ADD INDEX `fk_node-instance-property_node_id_idx` (`node_id` ASC),
	ADD INDEX `fk_node-instance-property_type_id_idx` (`node_type_id` ASC);
	ALTER TABLE `node-instance-property` 
	ADD CONSTRAINT `fk_node-instance-property_instance_id`
	  FOREIGN KEY (`node_instance_id`)
	  REFERENCES `node-instance` (`node_instance_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-instance-property_class_prop_id`
	  FOREIGN KEY (`node_class_property_id`)
	  REFERENCES `node-class-property` (`node_class_property_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-instance-property_node_id`
	  FOREIGN KEY (`node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-instance-property_type_id`
	  FOREIGN KEY (`node_type_id`)
	  REFERENCES `node-type` (`node_type_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;


#-------------------------------node-sub-class-------------------------------
	SELECT * FROM `node-sub-class` AS `nsc` 
	LEFT JOIN `node` AS `nd` ON `nd`.`node_id` = `nsc`.`primary_node_id` 
	WHERE `nd`.`primary_node_id` IS NULL;

	ALTER TABLE `node-sub-class` 
	ADD INDEX `fk_node-sub-class_prim_idx` (`primary_node_id` ASC),
	ADD INDEX `fk_node-sub-class_child_idx` (`child_node_id` ASC);
	ALTER TABLE `node-sub-class` 
	ADD CONSTRAINT `fk_node-sub-class_prim`
	  FOREIGN KEY (`primary_node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION,
	ADD CONSTRAINT `fk_node-sub-class_child`
	  FOREIGN KEY (`child_node_id`)
	  REFERENCES `node` (`node_id`)
	  ON DELETE NO ACTION
	  ON UPDATE NO ACTION;	

#-------------------------------node-x-y-relation-------------------------------
	DELETE `node-x-y-relation` FROM `node-x-y-relation` LEFT JOIN node AS nd ON node_id = node_x_id WHERE node_id IS NULL;
	DELETE `node-x-y-relation` FROM `node-x-y-relation` LEFT JOIN node AS nd ON node_id = node_y_id WHERE node_id IS NULL;
	
	ALTER TABLE `node-x-y-relation` 
	ADD INDEX `fk_node-x-y-relation_x_idx` (`node_x_id` ASC),
	ADD INDEX `fk_node-x-y-relation_y_idx` (`node_y_id` ASC);
	
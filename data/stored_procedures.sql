# STORED PROCEDURES

# --------------------------------
# --------------NEW---------------
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `createNode` $$
CREATE PROCEDURE `createNode`(IN nid VARCHAR(16), OUT lid INT)
	BEGIN
		INSERT INTO `node` (`node_uuid_id`,`name`)
	    VALUES (nid, '');
		SET @lid = LAST_INSERT_ID();
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getLastNumber` $$
CREATE PROCEDURE getLastNumber(IN tab_name varchar(64), IN col_name varchar(64))
	BEGIN
		SET @t1 =CONCAT('SELECT `node_id` FROM `',tab_name, '` ORDER BY `', col_name, '` DESC LIMIT 1');
		PREPARE stmt3 FROM @t1;
		EXECUTE stmt3;
		DEALLOCATE PREPARE stmt3;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getFormStructure` $$
CREATE PROCEDURE `getFormStructure`(IN nid INT, IN cpid INT)
	BEGIN
		SELECT `ni`.`node_instance_id` AS `node_instance_id`, `ni`.`node_id` AS `node_id`,
		`ni`.`node_class_id` AS `node_class_id`, `ncp`.`node_instance_id` AS `node_instance_id`, `ncp`.`value` AS `value`
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `ncp`
			ON `ncp`.`node_instance_id` = `ni`.`node_instance_id`
		WHERE `ni`.`node_id` = nid
			AND `ncp`.`node_class_property_id` = cpid;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getListHeader` $$
CREATE PROCEDURE `getListHeader`(IN niid INT)
	BEGIN
		SELECT `nc`.`node_class_id` AS `node_class_id`, `ncp`.`node_class_property_id` AS `node_class_property_id`,
		`ncp`.`node_class_property_parent_id` AS `node_class_property_parent_id`, `ncp`.`caption` AS `caption`, `ncp`.`encrypt_status` AS `encrypt_status`
		FROM `node-class` AS `nc`
		INNER JOIN `node-class-property` AS `ncp`
		ON `ncp`.`node_class_id` = `nc`.`node_class_id`
		WHERE `nc`.`node_id` = niid;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getNodeId` $$
CREATE PROCEDURE `getNodeId`(IN tab_name varchar(64), IN col_name varchar(64), IN val varchar(128))
	BEGIN
		SET @t1 = CONCAT('SELECT * FROM `',tab_name,'` WHERE `',col_name,'` = ',val);
		PREPARE stmt3 FROM @t1;
		EXECUTE stmt3;
		DEALLOCATE PREPARE stmt3;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `checkInArchivedStatus` $$
CREATE PROCEDURE `checkInArchivedStatus`(IN ncid INT, IN ncpid1 INT, IN ncpid2 INT, IN val1 INT, IN val2 INT)
	BEGIN
		SELECT `nip`.`node_instance_property_id` AS `node_instance_property_id`
		FROM `node-instance-property` AS `nip`
		INNER JOIN `node-class-property` AS `ncp`
			ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-instance-property` AS `nip1`
			ON `nip1`.`node_instance_id` = `nip`.`node_instance_id`
		WHERE `ncp`.`node_class_id` = ncid
			AND `nip`.`node_class_property_id` = ncpid1
			AND `nip1`.`node_class_property_id` = ncpid2
			AND `nip`.`value` = val1
			AND `nip1`.`value` = val2;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getVisibleNRequiredRoles` $$
CREATE PROCEDURE `getVisibleNRequiredRoles`(IN nid INT, IN ncpid INT)
	BEGIN
		SELECT GROUP_CONCAT(`nin`.`node_id`) AS `value`
		FROM `node-instance-property` AS `nip`
		INNER JOIN `node-instance` AS `ni`
			ON `ni`.`node_instance_id` = `nip`.`node_instance_id`
		INNER JOIN `node-instance` AS `nin`
			ON `nin`.`node_instance_id` = `nip`.`value`
		WHERE `ni`.`node_id` = nid
			AND `nip`.`node_class_property_id` = ncpid;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getActorWithRoleAndDeal` $$
CREATE PROCEDURE `getActorWithRoleAndDeal`(IN mracid INT, IN nid INT)
BEGIN
		SELECT `ni`.*, nip_role.value AS role, nip_deal.value AS deal,
			(SELECT nip_actor.value AS actor FROM `node-instance-property` AS `nip_actor`
			JOIN `node-class-property` AS `ncp_actor` ON `ncp_actor`.`node_class_property_id` = `nip_actor`.`node_class_property_id`
			AND ncp_actor.caption = 'Actor' WHERE `nip_actor`.`node_instance_id` = `ni`.`node_instance_id`) AS actor,
			(SELECT TRIM(CONCAT(nip_first_name.value, ' ', nip_last_name.value))
			FROM `node-instance-property` AS `nip_actor`
			JOIN `node-class-property` AS `ncp_actor` ON `ncp_actor`.`node_class_property_id` = `nip_actor`.`node_class_property_id` AND ncp_actor.caption = 'Actor'
			INNER JOIN `node-instance` AS `ni_actor` ON ni_actor.node_id = nip_actor.value
			INNER JOIN `node-instance-property` AS `nip_first_name` ON `ni_actor`.`node_instance_id` = `nip_first_name`.`node_instance_id`
			INNER JOIN `node-class-property` AS `ncp_first_name` ON `ncp_first_name`.`node_class_property_id` = `nip_first_name`.`node_class_property_id`
				AND ncp_first_name.caption = 'First Name'
			INNER JOIN `node-instance-property` AS `nip_last_name` ON `ni_actor`.`node_instance_id` = `nip_last_name`.`node_instance_id`
			INNER JOIN `node-class-property` AS `ncp_last_name` ON `ncp_last_name`.`node_class_property_id` = `nip_last_name`.`node_class_property_id`
				AND ncp_last_name.caption = 'Last Name'
			WHERE `nip_actor`.`node_instance_id` = `ni`.`node_instance_id`) AS user_name
		FROM `node-instance` AS `ni`
		INNER JOIN `node-instance-property` AS `nip_role` ON `nip_role`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp_role` ON `ncp_role`.`node_class_property_id` = `nip_role`.`node_class_property_id`
			AND ncp_role.caption = 'Role'
		INNER JOIN `node-instance-property` AS `nip_deal` ON `nip_deal`.`node_instance_id` = `ni`.`node_instance_id`
		INNER JOIN `node-class-property` AS `ncp_deal` ON `ncp_deal`.`node_class_property_id` = `nip_deal`.`node_class_property_id`
			AND ncp_deal.caption = 'Deal'
		WHERE `ni`.`node_class_id` = mracid AND nip_deal.value = nid;
	END$$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `checkDealInPassedByRoles` $$
CREATE PROCEDURE checkDealInPassedByRoles(IN ncid INT,IN ncpid INT,IN ncpid1 INT,IN ncpid2 INT,IN ncpid3 INT,IN val INT)
	BEGIN
		SELECT `nip`.`value` AS `deal`, `nip`.`node_instance_id` AS `node_instance_id`, `nip2`.`value` AS `from_role`, `nip3`.`value` AS `from_to`
		FROM `node-instance-property` AS `nip`
		INNER JOIN `node-class-property` AS `ncp` ON `ncp`.`node_class_property_id` = `nip`.`node_class_property_id`
		INNER JOIN `node-instance-property` AS `nip1` ON `nip1`.`node_instance_id` = `nip`.`node_instance_id`
		INNER JOIN `node-instance-property` AS `nip2` ON `nip2`.`node_instance_id` = `nip1`.`node_instance_id`
		INNER JOIN `node-instance-property` AS `nip3` ON `nip3`.`node_instance_id` = `nip2`.`node_instance_id`
		WHERE `ncp`.`node_class_id` = ncid
			AND `nip`.`node_class_property_id` = ncpid AND `nip1`.`node_class_property_id` = ncpid1
			AND `nip2`.`node_class_property_id` = ncpid2 AND `nip3`.`node_class_property_id` = ncpid3
			AND `nip`.`value` = val AND `nip1`.`value` = 1;
	END $$
DELIMITER ;
# --------------------------------
# --------------------------------
# --------------------------------
# --------------------------------


# --------------------------------
# --------------OLD---------------
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getinstanceDetails` $$
CREATE PROCEDURE getinstanceDetails(IN niid INT)
	BEGIN
		SELECT `node_id`
		FROM `node-instance`
		WHERE `node_instance_id` = niid;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getNodeXIdFromXYTable` $$
CREATE PROCEDURE getNodeXIdFromXYTable(IN nid INT)
	BEGIN
		SELECT `node_x_id`
		FROM `node-x-y-relation`
		WHERE `node_y_id` = nid;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getPropertiesY` $$
CREATE PROCEDURE `getPropertiesY`(IN nid INT, IN col_name varchar(64))
	BEGIN
		SET @t1 =CONCAT('SELECT * FROM `node-class-property` WHERE `node_class_id` = ',nid, ' AND `node_class_property_parent_id` = 0 ORDER BY ',col_name, ' ASC;');
		PREPARE stmt3 FROM @t1;
		EXECUTE stmt3;
		DEALLOCATE PREPARE stmt3;
	END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `getPropertiesN` $$
CREATE PROCEDURE `getPropertiesN`(IN nid INT, IN col_name varchar(64))
	BEGIN
		SET @t1 =CONCAT('SELECT * FROM `node-class-property` WHERE `node_class_id` = ',nid, ' ORDER BY ',col_name, ' DESC;');
		PREPARE stmt3 FROM @t1;
		EXECUTE stmt3;
		DEALLOCATE PREPARE stmt3;
	END $$
DELIMITER ;
# --------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `saveNodeX` $$
CREATE PROCEDURE `saveNodeX`(IN nyid INT, IN nxid INT)
	BEGIN
		INSERT INTO `node-x-y-relation` (`node_y_id`, `node_x_id`)
	    VALUES (nyid, nxid);
	END $$
DELIMITER ;
# --------------------------------

DELIMITER $$
DROP PROCEDURE IF EXISTS `updateSubInstancePropertyAgain` $$
CREATE PROCEDURE `updateSubInstancePropertyAgain`(IN val TEXT, IN estat INT, IN ntid INT, IN niid INT, IN ncpid INT)
	BEGIN
		UPDATE `node-instance-property`
		SET `value` = val, `encrypt_status` = estat, `node_type_id` = ntid
		WHERE `node_instance_id` = niid
		AND `node_class_property_id` = ncpid;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getinstanceDetailsByNodeId` $$
CREATE PROCEDURE getinstanceDetailsByNodeId(IN nid INT)
	BEGIN
		SELECT `node_instance_id`
		FROM `node-instance`
		WHERE `node_id` = nid;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `createInstanceU` $$
CREATE PROCEDURE `createInstanceU`(IN st INT, IN niid INT)
	BEGIN
		UPDATE `node-instance`
		SET `status` = st
		WHERE `node_instance_id` = niid;
	END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `createInstanceI` $$
CREATE PROCEDURE `createInstanceI`(IN st INT, IN estat INT, IN ntid INT, IN niid INT, IN ncid INT, IN cap TEXT, OUT node_instance_id INT)
	BEGIN
		INSERT INTO `node-instance` (`status`,`encrypt_status`,`node_type_id`,`node_id`,`node_class_id`,`caption`)
		VALUES (st, estat, ntid, niid, ncid, cap);
		SET node_instance_id = LAST_INSERT_ID();
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `createInstanceProperty` $$
CREATE PROCEDURE `createInstanceProperty`(IN val TEXT, IN estat INT, IN niid INT, IN nid INT, IN ntid INT, IN ncpid INT)
	BEGIN
		INSERT INTO `node-instance-property` (`value`,`encrypt_status`,`node_instance_id`,`node_id`,`node_type_id`,`node_class_property_id`)
		VALUES (val, estat, niid, nid, ntid, ncpid);		
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `createInstancePropertyAgain` $$
CREATE PROCEDURE `createInstancePropertyAgain`(IN val TEXT, IN estat INT, IN niid INT, IN nid INT, IN ntid INT, IN ncpid INT)
	BEGIN
		INSERT INTO `node-instance-property` (`value`,`encrypt_status`,`node_instance_id`,`node_id`,`node_type_id`,`node_class_property_id`)
		VALUES (val, estat, niid, nid, ntid, ncpid);		
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `getClassListY` $$
CREATE PROCEDURE getClassListY(IN nycid INT)
	BEGIN
		SELECT *
		FROM `node-class`
		WHERE `node_class_id` = nycid;
	END $$
DELIMITER ;

DELIMITER $$
DROP PROCEDURE IF EXISTS `getClassListO` $$
CREATE PROCEDURE getClassListO()
	BEGIN
		SELECT *
		FROM `node-class`		
		ORDER BY `node_class_id` ASC;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `fetchNodeInstanceProperty` $$
CREATE PROCEDURE fetchNodeInstanceProperty(IN niid INT)
	BEGIN
		SELECT *
		FROM `node-instance-property`
		WHERE `node_instance_id` = niid
		ORDER BY `node_class_property_id` ASC;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `fetchDocumentNodeInstanceIds` $$
CREATE PROCEDURE fetchDocumentNodeInstanceIds(IN ncpid INT)
	BEGIN
		SELECT DISTINCT(`node_instance_id`)
		FROM `node-instance-property`
		WHERE `node_class_property_id` = ncpid
		AND `value` = 'Document'
		ORDER BY `node_instance_property_id` DESC;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `fetchDocumentList` $$
CREATE PROCEDURE fetchDocumentList(IN niid INT, IN ncpid INT)
	BEGIN
		SELECT `nip`.`node_instance_id`, `nip`.`value`, `ni`.`node_id` , `ni`.`status`
		FROM `node-instance-property` AS `nip`
		LEFT JOIN `node-instance` AS `ni`
			ON `ni`.`node_instance_id` = `nip`.`node_instance_id`
		WHERE `nip`.`node_instance_id` = niid
		AND `nip`.`node_class_property_id` = ncpid;
	END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `fetchCourseNodeInstanceIds` $$
CREATE PROCEDURE fetchCourseNodeInstanceIds(IN ncpid INT)
  BEGIN
  SELECT `node_instance_id`,`value`
  FROM `node-instance-property`
  WHERE `node_class_property_id` = ncpid
  AND (`value` = 'Process' OR `value` = 'Associations')
  ORDER BY `node_instance_property_id` DESC;
 END $$
DELIMITER ;
# ---------------------------------
DELIMITER $$
DROP PROCEDURE IF EXISTS `fetchCourseList` $$
CREATE PROCEDURE fetchCourseList(IN niid INT, IN ncpid INT)
  BEGIN
  SELECT `nip`.`node_instance_id`, `nip`.`value`, `ni`.`node_id` , `ni`.`status`
  FROM `node-instance-property` AS `nip`
  LEFT JOIN `node-instance` AS `ni`
  ON `ni`.`node_instance_id` = `nip`.`node_instance_id`
  WHERE `nip`.`node_instance_id` = niid
  AND `nip`.`node_class_property_id` = ncpid;
 END $$
DELIMITER ;
# ---------------------------------

